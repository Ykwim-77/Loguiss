// Quantos dias a IA pode prever (o usuário escolhe um destes na configuração)
export const HORIZONTES_VALIDOS = [5, 10, 14, 30];

// De quantos em quantos minutos pode haver consulta automática à IA.
// O mínimo existe para proteger o custo: cada consulta usa a IA de verdade.
export const INTERVALO_MINIMO_MINUTOS = 15;
export const INTERVALO_MAXIMO_MINUTOS = 43200; // 30 dias

export const PRAZO_REPOSICAO_MINIMO_DIAS = 1;
export const PRAZO_REPOSICAO_MAXIMO_DIAS = 60;

export const DIAS_HISTORICO = 60; // quantos dias de saídas são enviados à IA
export const PRODUTOS_POR_LOTE = 10; // produtos por chamada de previsão
export const MAX_ALERTAS_POR_PRODUTO = 3;

export default {
  HORIZONTES_VALIDOS,
  INTERVALO_MINIMO_MINUTOS,
  INTERVALO_MAXIMO_MINUTOS,
  PRAZO_REPOSICAO_MINIMO_DIAS,
  PRAZO_REPOSICAO_MAXIMO_DIAS,
  DIAS_HISTORICO,
  PRODUTOS_POR_LOTE,
  MAX_ALERTAS_POR_PRODUTO,
};