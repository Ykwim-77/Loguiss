/**
 * Fluxo completo de uma previsão nova:
 *   configuração e empresa → dados do banco → IA (contexto) → IA (previsão)
 *   → contas no Node → salvar → devolver no formato do front.
 *
 * Usado pela rota manual (POST /previsoes) e pelo agendador automático.
 */
import { erroHttp } from '../../utils/erros.js';
import { HORIZONTES_VALIDOS } from '../../utils/previsao/constantes.js';
import calc from '../../utils/previsao/calculos.js';
import { buscarConfiguracaoIA } from '../configuracaoIA/buscarConfiguracaoIA.service.js';
import { buscarEmpresa } from '../empresa/buscarEmpresa.service.js';
import { montarDadosPrevisao } from './montarDadosPrevisao.service.js';
import { consultarContextoIA } from './consultarContextoIA.service.js';
import { consultarPrevisaoIA } from './consultarPrevisaoIA.service.js';
import { salvarPrevisao } from './salvarPrevisao.service.js';
import { buscarPrevisao } from './buscarPrevisao.service.js';

let gerandoAgora = false;

/**
 * opcoes (todas opcionais): { horizonteDias, localizacao, segmento, idsProdutos }
 * Sem horizonteDias, usa o da configuração da IA.
 */
export async function gerarPrevisao(opcoes = {}) {
  if (gerandoAgora) {
    throw erroHttp(409, 'Já existe uma previsão sendo gerada. Aguarde terminar.', 'JA_GERANDO');
  }

  gerandoAgora = true;
  try {
    const [config, empresa] = await Promise.all([
      buscarConfiguracaoIA(),
      buscarEmpresa(),
    ]);

    const horizonteDias = Number(opcoes.horizonteDias ?? config.horizonte_dias);
    if (!HORIZONTES_VALIDOS.includes(horizonteDias)) {
      throw erroHttp(
        400,
        `horizonteDias deve ser um destes valores: ${HORIZONTES_VALIDOS.join(', ')}.`,
        'HORIZONTE_INVALIDO'
      );
    }

    const descricao = calc.descreverEmpresa(empresa);
    if (!descricao.completo) {
      console.warn('[previsao] cidade, UF ou segmento não cadastrados na empresa: a pesquisa da IA ficará genérica.');
    }
    const localizacao = String(opcoes.localizacao || descricao.localizacao).trim();
    const segmento = String(opcoes.segmento || descricao.segmento).trim();
    const idsProdutos = Array.isArray(opcoes.idsProdutos)
      ? opcoes.idsProdutos.map(Number).filter(Number.isInteger)
      : [];

    const dados = await montarDadosPrevisao({
      horizonteDias,
      idsProdutos,
      prazoPadraoDias: config.prazo_reposicao_padrao_dias,
    });

    const contexto = await consultarContextoIA({ ...dados, localizacao, segmento });
    const previsao = await consultarPrevisaoIA({ ...dados, contexto: contexto.contexto });

    const linhas = calc.montarLinhas(dados.entradas, previsao.previsoes);
    const alertas = calc.consolidarAlertas(linhas, previsao.alertasIA);

    const idPrevisao = await salvarPrevisao({
      horizonteDias,
      modelo: contexto.modelo ?? previsao.modelo,
      localizacao,
      segmento,
      contexto: contexto.contexto,
      contextoBruto: contexto.bruto,
      dadosEnviados: previsao.dadosEnviados,
      respostasBrutas: previsao.respostasBrutas,
      linhas,
      alertas,
    });

    return await buscarPrevisao({ id: idPrevisao });
  } finally {
    gerandoAgora = false;
  }
}


export default { gerarPrevisao };