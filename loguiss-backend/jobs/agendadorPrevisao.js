/**
 * Consulta a IA automaticamente de X em X minutos, conforme a configuração da IA
 * (tabela configuracao_ia): agendamento_ativo, intervalo_minutos e horizonte_dias.
 *
 * Regras:
 *  - A próxima consulta = (última previsão salva) + intervalo. Se o servidor ficou
 *    desligado e já passou do prazo, consulta logo depois de subir.
 *  - Se nunca houve previsão, a primeira consulta automática ocorre um intervalo
 *    depois que o servidor subiu (evita gastar IA sem querer).
 *  - Ao salvar a configuração, a contagem recomeça a partir daquele momento.
 *  - Se uma consulta falhar, a próxima tentativa só ocorre depois de um novo
 *    intervalo (não fica tentando em loop e gastando).
 *  - Uma consulta manual (POST /previsoes) também adia a próxima automática.
 */
import {prisma} from '../database.js';
import { buscarConfiguracaoIA } from '../services/configuracaoIA/buscarConfiguracaoIA.service.js';
import { gerarPrevisao } from '../services/previsao/gerarPrevisao.service.js';

const ESPERA_MINIMA_MS = 10 * 1000;
const RETENTATIVA_ERRO_MS = 5 * 60 * 1000;
// setTimeout não aceita esperas acima de ~24,8 dias: limitamos e reavaliamos ao disparar.
const MAX_ESPERA_MS = 24 * 24 * 60 * 60 * 1000;

const INICIO_PROCESSO = Date.now();

let timer = null;
let proximaEm = null;
let contagemIniciadaEm = 0;

function limpar() {
  if (timer) clearTimeout(timer);
  timer = null;
  proximaEm = null;
}

async function calcularProximaExecucao(configuracao) {
  const ultima = await prisma.previsao.findFirst({
    orderBy: { created_at: 'desc' },
    select: { created_at: true },
  });

  const base = Math.max(
    ultima ? new Date(ultima.created_at).getTime() : INICIO_PROCESSO,
    contagemIniciadaEm
  );
  return base + configuracao.intervalo_minutos * 60 * 1000;
}

async function agendar() {
  limpar();

  try {
    const configuracao = await buscarConfiguracaoIA();
    if (!configuracao.agendamento_ativo) return;

    const proxima = await calcularProximaExecucao(configuracao);
    const espera = Math.max(proxima - Date.now(), ESPERA_MINIMA_MS);

    proximaEm = Date.now() + espera;
    timer = setTimeout(executar, Math.min(espera, MAX_ESPERA_MS));
    if (timer.unref) timer.unref();
  } catch (erro) {
    console.error(`[agendador] erro ao agendar: ${erro.message}`);
    timer = setTimeout(agendar, RETENTATIVA_ERRO_MS);
    if (timer.unref) timer.unref();
  }
}

async function executar() {
  timer = null;

  try {
    const configuracao = await buscarConfiguracaoIA();

    if (configuracao.agendamento_ativo) {
      const proxima = await calcularProximaExecucao(configuracao);

      if (Date.now() >= proxima - 1000) {
        contagemIniciadaEm = Date.now(); // vale também como backoff se a consulta falhar
        console.log('[agendador] gerando previsão automática...');
        await gerarPrevisao({}); // usa o horizonte da configuração
        console.log('[agendador] previsão automática concluída.');
      }
    }
  } catch (erro) {
    console.error(`[agendador] falha ao gerar a previsão: ${erro.message}`);
  } finally {
    await agendar();
  }
}

/** Chame uma vez, depois de o servidor subir (app.listen). */
export function iniciarAgendador() {
  return agendar();
}

/** Chame depois de salvar a configuração da IA. */
export function reagendar() {
  contagemIniciadaEm = Date.now();
  return agendar();
}

export function statusAgendador() {
  return {
    agendamentoEmAndamento: proximaEm !== null,
    proximaExecucaoEm: proximaEm ? new Date(proximaEm).toISOString() : null,
  };
}

export default { iniciarAgendador, reagendar, statusAgendador };