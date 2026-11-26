import prompts from '../../utils/previsao/prompts.js';
import calc from '../../utils/previsao/calculos.js';
import { PRODUTOS_POR_LOTE } from '../../utils/previsao/constantes.js';
import { consultarJsonValidado } from '../../utils/previsao/consultarJsonValidado.js';

const CONCORRENCIA_LOTES = 2;

function podeUsarPrevisaoLocal(error) {
  const status = Number(error?.status);
  const codigoRede = error?.code ?? error?.cause?.code;
  const falhaRede = [
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'EAI_AGAIN',
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_HEADERS_TIMEOUT',
  ].includes(codigoRede);
  return (
    ['IA_SEM_CHAVE', 'IA_RESPOSTA_INVALIDA', 'GEMINI_INDISPONIVEL'].includes(error?.codigo) ||
    (status >= 400 && status < 600) ||
    falhaRede ||
    error?.name === 'AbortError' ||
    String(error?.message || '').startsWith('Timeout (')
  );
}

function montarSchemaResposta() {
  return {
    type: 'object',
    properties: {
      horizonte_dias: { type: 'integer' },
      produtos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id_produto: { type: 'integer' },
            quantidades_por_dia: {
              type: 'array',
              items: { type: 'number' },
            },
            confianca: { type: 'number' },
            justificativa: { type: 'string' },
          },
          required: ['id_produto', 'quantidades_por_dia', 'confianca', 'justificativa'],
        },
      },
      alertas: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id_produto: { type: 'integer' },
            severidade: { type: 'string' },
            titulo: { type: 'string' },
            descricao: { type: 'string' },
          },
          required: ['id_produto', 'severidade', 'titulo', 'descricao'],
        },
      },
    },
    required: ['horizonte_dias', 'produtos', 'alertas'],
  };
}

/**
 * Passo 2 da IA: com o contexto pronto, ela prevê as saídas diárias dos produtos
 * (em lotes, sem pesquisar na web).
 */
export async function consultarPrevisaoIA({
  hoje,
  dataInicioPrevisao,
  dataFimPrevisao,
  datasPrevisao,
  horizonteDias,
  entradas,
  contexto,
}) {
  const lotes = calc.dividirEmLotes(entradas, PRODUTOS_POR_LOTE);
  const resultados = new Array(lotes.length);
  let indiceAtual = 0;

  async function processarProximo() {
    while (indiceAtual < lotes.length) {
      const idx = indiceAtual++;
      const lote = lotes[idx];
      const idsLote = new Set(lote.map((e) => e.id_produto));
      const usuarioMontado = prompts.montarMensagemPrevisao({
        dataReferencia: hoje,
        dataInicioPrevisao,
        dataFimPrevisao,
        horizonteDias,
        contexto,
        produtos: lote,
      });
      const usuarioParsed = JSON.parse(usuarioMontado);

      let resposta;
      try {
        resposta = await consultarJsonValidado(
          {
            system: prompts.SYSTEM_PREVISAO,
            usuario: usuarioMontado,
            usarBuscaWeb: false,
            maxTokens: 2000 + lote.length * horizonteDias * 6,
            timeoutMs: 25000,
            responseJsonSchema: montarSchemaResposta(),
          },
          (json) =>
            calc.validarPrevisao(json, {
              idsEsperados: idsLote,
              datasEsperadas: datasPrevisao,
            })
        );
      } catch (error) {
        if (!podeUsarPrevisaoLocal(error)) throw error;

        console.warn(
          `[previsao] IA indisponível para o lote ${idx + 1}; usando projeção local.`
        );
        resultados[idx] = {
          produtos: calc.preverLocalmente(lote, datasPrevisao),
          alertas: [],
          dadosEnviados: usuarioParsed,
          respostaBruta: { modo: 'fallback-local', status: error.status ?? null },
          modelo: 'fallback-local',
          fallbackLocal: true,
        };
        continue;
      }

      resultados[idx] = {
        produtos: resposta.dados.produtos,
        alertas: resposta.dados.alertas,
        dadosEnviados: usuarioParsed,
        respostaBruta: resposta.bruto,
        modelo: resposta.modelo,
        fallbackLocal: false,
      };
    }
  }

  const workers = Array.from(
    { length: Math.min(CONCORRENCIA_LOTES, lotes.length) },
    () => processarProximo()
  );
  await Promise.all(workers);

  const previsoes = new Map();
  const alertasIA = [];
  const dadosEnviados = [];
  const respostasBrutas = [];
  const modelosGemini = new Set();
  let usouFallbackLocal = false;

  for (const r of resultados) {
    if (!r) continue;
    if (r.fallbackLocal) usouFallbackLocal = true;
    else if (r.modelo) modelosGemini.add(r.modelo);
    for (const [id, previsao] of r.produtos) previsoes.set(id, previsao);
    alertasIA.push(...r.alertas);
    dadosEnviados.push(r.dadosEnviados);
    respostasBrutas.push(r.respostaBruta);
  }

  const modelo = usouFallbackLocal
    ? modelosGemini.size
      ? 'misto-gemini-e-local'
      : 'fallback-local'
    : modelosGemini.values().next().value ?? null;

  return {
    previsoes,
    alertasIA,
    dadosEnviados,
    respostasBrutas,
    modelo,
    fallbackLocal: usouFallbackLocal,
  };
}

export default { consultarPrevisaoIA };