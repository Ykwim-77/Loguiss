import prompts from '../../utils/previsao/prompts.js';
import calc from '../../utils/previsao/calculos.js';
import { PRODUTOS_POR_LOTE } from '../../utils/previsao/constantes.js';
import { consultarJsonValidado } from '../../utils/previsao/consultarJsonValidado.js';

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
  const previsoes = new Map();
  const alertasIA = [];
  const dadosEnviados = [];
  const respostasBrutas = [];
  let modelo = null;

  for (const lote of calc.dividirEmLotes(entradas, PRODUTOS_POR_LOTE)) {
    const idsLote = new Set(lote.map((e) => e.id_produto));
    const usuario = prompts.montarMensagemPrevisao({
      dataReferencia: hoje,
      dataInicioPrevisao,
      dataFimPrevisao,
      horizonteDias,
      contexto,
      produtos: lote,
    });

    const resposta = await consultarJsonValidado(
      {
        system: prompts.SYSTEM_PREVISAO,
        usuario,
        usarBuscaWeb: false,
        maxTokens: 2000 + lote.length * horizonteDias * 6,
      },
      (json) => calc.validarPrevisao(json, { idsEsperados: idsLote, datasEsperadas: datasPrevisao })
    );

    modelo = modelo ?? resposta.modelo;
    for (const [id, previsao] of resposta.dados.produtos) previsoes.set(id, previsao);
    alertasIA.push(...resposta.dados.alertas);
    dadosEnviados.push(JSON.parse(usuario));
    respostasBrutas.push(resposta.bruto);
  }

  return { previsoes, alertasIA, dadosEnviados, respostasBrutas, modelo };
}

export default { consultarPrevisaoIA };