import prompts from '../../utils/previsao/prompts.js';
import calc from '../../utils/previsao/calculos.js';
import { consultarJsonValidado } from '../../utils/previsao/consultarJsonValidado.js';

const CACHE_CONTEXTO_MS = 6 * 60 * 60 * 1000;
let contextoCache = null;

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
    const categorias = [...new Set(entradas.map((e) => String(e.categoria || '').trim()).filter(Boolean))]
      .slice(0, 8)
      .map((categoria) => categoria.slice(0, 40));
    const chaveCache = JSON.stringify([
      hoje,
      dataInicioPrevisao,
      dataFimPrevisao,
      horizonteDias,
      localizacao,
      segmento,
      categorias,
    ]);

    if (contextoCache?.chave === chaveCache && contextoCache.expiraEm > Date.now()) {
      return contextoCache.valor;
    }

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
        maxTokens: 900,
        timeoutMs: 12000,
      },
      calc.validarContexto
    );

    const valor = { contexto: resposta.dados, bruto: resposta.bruto, modelo: resposta.modelo };
    contextoCache = { chave: chaveCache, expiraEm: Date.now() + CACHE_CONTEXTO_MS, valor };
    return valor;
  } catch (erro) {
    console.warn(`[previsao] seguindo sem contexto: ${erro.message}`);
    return {
      contexto: { eventos: [], sazonalidade: '', fontes: [], indisponivel: true },
      bruto: null,
      modelo: null,
    };
  }
}

export default { consultarContextoIA };