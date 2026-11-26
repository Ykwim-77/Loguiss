import prompts from '../../utils/previsao/prompts.js';
import calc from '../../utils/previsao/calculos.js';
import { consultarJsonValidado } from '../../utils/previsao/consultarJsonValidado.js';

/**
 * Passo 1 da IA: ela pesquisa na web eventos, feriados e sazonalidade
 * para a localização e o segmento da empresa.
 */
export async function consultarContextoIA({
  hoje,
  dataInicioPrevisao,
  dataFimPrevisao,
  horizonteDias,
  localizacao,
  segmento,
  entradas,
}) {
  try {
    const categorias = [...new Set(entradas.map((e) => e.categoria))];

    const resposta = await consultarJsonValidado(
      {
        system: prompts.SYSTEM_CONTEXTO,
        usuario: prompts.montarMensagemContexto({
          dataReferencia: hoje,
          dataInicio: dataInicioPrevisao,
          dataFim: dataFimPrevisao,
          horizonteDias,
          localizacao,
          segmento,
          categorias,
        }),
        usarBuscaWeb: true,
        maxTokens: 3000,
      },
      calc.validarContexto
    );

    return { contexto: resposta.dados, bruto: resposta.bruto, modelo: resposta.modelo };
  } catch (erro) {
    if (erro.codigo === 'IA_SEM_CHAVE') throw erro;

    console.warn(`[previsao] seguindo sem contexto: ${erro.message}`);
    return {
      contexto: { eventos: [], sazonalidade: '', fontes: [], indisponivel: true },
      bruto: null,
      modelo: null,
    };
  }
}

export default { consultarContextoIA };