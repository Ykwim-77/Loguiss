import { erroHttp } from './erros.js';
import {
  HORIZONTES_VALIDOS,
  INTERVALO_MINIMO_MINUTOS,
  INTERVALO_MAXIMO_MINUTOS,
  PRAZO_REPOSICAO_MINIMO_DIAS,
  PRAZO_REPOSICAO_MAXIMO_DIAS,
} from './previsao/constantes.js';

function inteiroEntre(valor, minimo, maximo) {
  const numero = Number(valor);
  return valor !== null && valor !== '' && Number.isInteger(numero) && numero >= minimo && numero <= maximo
    ? numero
    : null;
}

/**
 * Valida o corpo da requisição (só os campos enviados) e devolve já com os
 * nomes das colunas do banco.
 */
export function validarConfiguracaoIA(corpo = {}) {
  const dados = {};

  if (corpo.horizonteDias !== undefined) {
    const horizonte = Number(corpo.horizonteDias);
    if (!HORIZONTES_VALIDOS.includes(horizonte)) {
      throw erroHttp(400, `horizonteDias deve ser um destes valores: ${HORIZONTES_VALIDOS.join(', ')}.`, 'CONFIG_INVALIDA');
    }
    dados.horizonte_dias = horizonte;
  }

  if (corpo.intervaloMinutos !== undefined) {
    const intervalo = inteiroEntre(corpo.intervaloMinutos, INTERVALO_MINIMO_MINUTOS, INTERVALO_MAXIMO_MINUTOS);
    if (intervalo === null) {
      throw erroHttp(
        400,
        `intervaloMinutos deve ser um número inteiro entre ${INTERVALO_MINIMO_MINUTOS} e ${INTERVALO_MAXIMO_MINUTOS}.`,
        'CONFIG_INVALIDA'
      );
    }
    dados.intervalo_minutos = intervalo;
  }

  if (corpo.agendamentoAtivo !== undefined) {
    if (typeof corpo.agendamentoAtivo !== 'boolean') {
      throw erroHttp(400, 'agendamentoAtivo deve ser true ou false.', 'CONFIG_INVALIDA');
    }
    dados.agendamento_ativo = corpo.agendamentoAtivo;
  }

  if (corpo.prazoReposicaoPadraoDias !== undefined) {
    const prazo = inteiroEntre(corpo.prazoReposicaoPadraoDias, PRAZO_REPOSICAO_MINIMO_DIAS, PRAZO_REPOSICAO_MAXIMO_DIAS);
    if (prazo === null) {
      throw erroHttp(
        400,
        `prazoReposicaoPadraoDias deve ser um número inteiro entre ${PRAZO_REPOSICAO_MINIMO_DIAS} e ${PRAZO_REPOSICAO_MAXIMO_DIAS}.`,
        'CONFIG_INVALIDA'
      );
    }
    dados.prazo_reposicao_padrao_dias = prazo;
  }

  if (!Object.keys(dados).length) {
    throw erroHttp(
      400,
      'Informe ao menos um campo: horizonteDias, intervaloMinutos, agendamentoAtivo ou prazoReposicaoPadraoDias.',
      'CONFIG_INVALIDA'
    );
  }

  return dados;
}

/** Nomes do banco (snake_case) para o formato da API. */
export function formatarConfiguracaoIA(configuracao) {
  return {
    horizonteDias: configuracao.horizonte_dias,
    intervaloMinutos: configuracao.intervalo_minutos,
    agendamentoAtivo: configuracao.agendamento_ativo,
    prazoReposicaoPadraoDias: configuracao.prazo_reposicao_padrao_dias,
    atualizadoEm: configuracao.updated_at,
  };
}

export default { validarConfiguracaoIA, formatarConfiguracaoIA };