import { erroHttp } from '../erros.js';
import { consultarIA, extrairJson } from '../iaClient.js';

/** Chama a IA e valida a resposta. Se vier fora do formato, tenta mais uma vez. */
export async function consultarJsonValidado(parametros, validar) {
  let ultimoErro;
  const timeoutTotalMs = Number(parametros.timeoutMs) > 0 ? Number(parametros.timeoutMs) : 30000;
  const deadline = Date.now() + timeoutTotalMs;

  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    // Falhas de rede, chave ou API sobem direto (não adianta tentar de novo).
    const restanteMs = deadline - Date.now();
    if (restanteMs <= 0) break;
    const resposta = await consultarIA({ ...parametros, timeoutMs: restanteMs });

    try {
      const json = extrairJson(resposta.texto);
      return { dados: validar(json), bruto: json, modelo: resposta.modelo };
    } catch (erro) {
      ultimoErro = erro;
      console.warn(`[previsao] resposta fora do formato (tentativa ${tentativa}): ${erro.message}`);
    }
  }

  throw erroHttp(
    502,
    `A IA devolveu uma resposta fora do formato esperado: ${ultimoErro.message}`,
    'IA_RESPOSTA_INVALIDA'
  );
}

export default { consultarJsonValidado };