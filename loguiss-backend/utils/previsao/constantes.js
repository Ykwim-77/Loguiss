// Quantos dias a IA pode prever (o usuário escolhe um destes na configuração)
export const HORIZONTES_VALIDOS = [5, 10, 14, 30];

// De quantos em quantos minutos pode haver consulta automática à IA.
// O mínimo existe para proteger o custo: cada consulta usa a IA de verdade.
export const INTERVALO_MINIMO_MINUTOS = 15;
export const INTERVALO_MAXIMO_MINUTOS = 43200; // 30 dias

export const PRAZO_REPOSICAO_MINIMO_DIAS = 1;
export const PRAZO_REPOSICAO_MAXIMO_DIAS = 60;

export const DIAS_HISTORICO = 30; // histórico necessário para calcular as médias de 7 e 30 dias
export const DIAS_HISTORICO_ENVIADO = 14; // duas semanas bastam para capturar o padrão semanal
export const MAX_PRODUTOS_PREVISAO = 20;
export const MAX_MOVIMENTACOES_PREVISAO = 40;
export const PRODUTOS_POR_LOTE = MAX_PRODUTOS_PREVISAO; // até 20 produtos em uma chamada
export const MAX_ALERTAS_POR_PRODUTO = 3;

export default {
  HORIZONTES_VALIDOS,
  INTERVALO_MINIMO_MINUTOS,
  INTERVALO_MAXIMO_MINUTOS,
  PRAZO_REPOSICAO_MINIMO_DIAS,
  PRAZO_REPOSICAO_MAXIMO_DIAS,
  DIAS_HISTORICO,
  DIAS_HISTORICO_ENVIADO,
  MAX_PRODUTOS_PREVISAO,
  MAX_MOVIMENTACOES_PREVISAO,
  PRODUTOS_POR_LOTE,
  MAX_ALERTAS_POR_PRODUTO,
};