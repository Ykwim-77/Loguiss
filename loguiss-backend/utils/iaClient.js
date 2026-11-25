import { GoogleGenAI } from '@google/genai';
import { erroHttp } from './erros.js';

const MODELO_PADRAO = process.env.GEMINI_MODEL || 'gemini-3.7-flash';
const MODELOS_FALLBACK = (
  process.env.GEMINI_FALLBACK_MODELS ||
  process.env.GEMINI_FALLBACK_MODEL ||
  'gemma-4-31b-it,gemma-4-26b-a4b-it,gemini-3.1-flash-lite,gemini-3.5-flash-lite'
)
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const BUSCA_WEB_HABILITADA = process.env.GEMINI_USAR_BUSCA_WEB !== 'false';

function obterCliente() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw erroHttp(
      500,
      'Chave GEMINI_API_KEY não configurada no ambiente.',
      'IA_SEM_CHAVE'
    );
  }
  return new GoogleGenAI({ apiKey });
}

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ehErro503(error) {
  const mensagem = String(error?.message || '');
  return (
    error?.status === 503 ||
    mensagem.includes('"code":503') ||
    mensagem.includes('UNAVAILABLE')
  );
}

function ehErroCota429(error) {
  const mensagem = String(error?.message || '');
  return (
    error?.status === 429 ||
    mensagem.includes('"code":429') ||
    mensagem.includes('RESOURCE_EXHAUSTED')
  );
}

export function extrairJson(texto) {
  if (!texto || typeof texto !== 'string') {
    throw new Error('Resposta vazia da IA.');
  }

  const limpo = texto
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(limpo);
  } catch {
    const inicio = limpo.indexOf('{');
    const fim = limpo.lastIndexOf('}');
    if (inicio !== -1 && fim !== -1 && fim > inicio) {
      return JSON.parse(limpo.slice(inicio, fim + 1));
    }
    throw new Error('Não foi possível extrair um JSON válido da resposta da IA.');
  }
}

function extrairTextoResposta(response) {
  if (typeof response?.text === 'string' && response.text.trim()) {
    return response.text.trim();
  }

  const parts = response?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const combinado = parts
      .filter((p) => typeof p?.text === 'string' && !p?.thought)
      .map((p) => p.text)
      .join('')
      .trim();
    if (combinado) return combinado;
  }

  return '';
}

function montarConfig(modelo, { system, usarBuscaWeb, maxTokens }) {
  const ehGemma = modelo.toLowerCase().startsWith('gemma');
  const config = {
    maxOutputTokens: Math.max(Number(maxTokens) || 2048, 4096),
  };

  if (system && !ehGemma) {
    config.systemInstruction = system;
  }

  if (usarBuscaWeb && BUSCA_WEB_HABILITADA && !ehGemma) {
    config.tools = [{ googleSearch: {} }];
  } else if (!ehGemma) {
    config.responseMimeType = 'application/json';
  }

  return config;
}

function montarContents(modelo, system, usuario) {
  const ehGemma = modelo.toLowerCase().startsWith('gemma');
  if (ehGemma && system) {
    return `${system}\n\n${usuario}`;
  }
  return usuario;
}

async function executarChamada(ai, modelo, { system, usuario, usarBuscaWeb, maxTokens }) {
  const config = montarConfig(modelo, { system, usarBuscaWeb, maxTokens });
  const contents = montarContents(modelo, system, usuario);

  const response = await ai.models.generateContent({
    model: modelo,
    contents,
    config,
  });

  const texto = extrairTextoResposta(response);
  const finishReason = response?.candidates?.[0]?.finishReason;

  if (!texto) {
    const erro = new Error(
      finishReason === 'MALFORMED_FUNCTION_CALL'
        ? 'A IA retornou MALFORMED_FUNCTION_CALL sem texto.'
        : 'A resposta da IA veio vazia.'
    );
    erro.finishReason = finishReason;
    throw erro;
  }

  return { texto, modelo };
}

async function gerarComModelo(ai, modelo, { system, usuario, usarBuscaWeb, maxTokens }) {
  const maxTentativas = 2;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await executarChamada(ai, modelo, {
        system,
        usuario,
        usarBuscaWeb,
        maxTokens,
      });
    } catch (error) {
      // Se deu MALFORMED_FUNCTION_CALL com busca web, tenta imediatamente sem busca web
      if (error?.finishReason === 'MALFORMED_FUNCTION_CALL' && usarBuscaWeb) {
        console.warn(
          `[iaClient] ${modelo} retornou MALFORMED_FUNCTION_CALL com busca web, tentando sem busca web...`
        );
        return await executarChamada(ai, modelo, {
          system,
          usuario,
          usarBuscaWeb: false,
          maxTokens,
        });
      }

      if (ehErro503(error) && tentativa < maxTentativas) {
        console.warn(`[iaClient] ${modelo} retornou 503, tentando novamente em 500ms...`);
        await esperar(500);
        continue;
      }

      throw error;
    }
  }
}

export async function consultarIA({
  system,
  usuario,
  usarBuscaWeb = false,
  maxTokens = 4096,
  modelo = MODELO_PADRAO,
}) {
  const ai = obterCliente();
  const params = { system, usuario, usarBuscaWeb, maxTokens };

  const candidatos = [modelo, ...MODELOS_FALLBACK].filter(
    (m, idx, arr) => m && arr.indexOf(m) === idx
  );

  let ultimoErro = null;

  for (let i = 0; i < candidatos.length; i++) {
    const atual = candidatos[i];
    const ehPrincipal = i === 0;

    if (!ehPrincipal) {
      console.warn(`[iaClient] usando modelo de fallback: ${atual}`);
    }

    try {
      return await gerarComModelo(ai, atual, params);
    } catch (error) {
      ultimoErro = error;

      if (ehPrincipal && ehErroCota429(error) && usarBuscaWeb && BUSCA_WEB_HABILITADA) {
        console.warn(
          `[iaClient] cota atingida com busca web em ${atual}, tentando sem busca web...`
        );
        try {
          return await gerarComModelo(ai, atual, { ...params, usarBuscaWeb: false });
        } catch (erroSemBusca) {
          ultimoErro = erroSemBusca;
          error = erroSemBusca;
        }
      }

      if (ehErro503(error) || ehErroCota429(error)) {
        if (i < candidatos.length - 1) {
          await esperar(150);
          continue;
        }
      }

      throw error;
    }
  }

  throw ultimoErro;
}

export async function chamarIA(promptOuMensagens) {
  const usuario = Array.isArray(promptOuMensagens)
    ? promptOuMensagens.map((m) => `${m.role}: ${m.content}`).join('\n')
    : promptOuMensagens;

  const { texto } = await consultarIA({ usuario });
  return texto;
}

export default {
  consultarIA,
  extrairJson,
  chamarIA,
};