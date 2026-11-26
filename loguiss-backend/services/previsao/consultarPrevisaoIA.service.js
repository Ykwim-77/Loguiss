import prompts from '../../utils/previsao/prompts.js';
import calc from '../../utils/previsao/calculos.js';
import { PRODUTOS_POR_LOTE } from '../../utils/previsao/constantes.js';
import { consultarJsonValidado } from '../../utils/previsao/consultarJsonValidado.js';

const CONCORRENCIA_LOTES = 2;

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

      const resposta = await consultarJsonValidado(
        {
          system: prompts.SYSTEM_PREVISAO,
          usuario: usuarioMontado,
          usarBuscaWeb: false,
          maxTokens: 2000 + lote.length * horizonteDias * 6,
        },
        (json) => calc.validarPrevisao(json, { idsEsperados: idsLote, datasEsperadas: datasPrevisao })
      );

      resultados[idx] = {
        produtos: resposta.dados.produtos,
        alertas: resposta.dados.alertas,
        dadosEnviados: usuarioParsed,
        respostaBruta: resposta.bruto,
        modelo: resposta.modelo,
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
  let modelo = null;

  for (const r of resultados) {
    if (!r) continue;
    modelo = modelo ?? r.modelo;
    for (const [id, previsao] of r.produtos) previsoes.set(id, previsao);
    alertasIA.push(...r.alertas);
    dadosEnviados.push(r.dadosEnviados);
    respostasBrutas.push(r.respostaBruta);
  }

  return { previsoes, alertasIA, dadosEnviados, respostasBrutas, modelo };
}

export default { consultarPrevisaoIA };