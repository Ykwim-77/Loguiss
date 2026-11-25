/**
 * Transforma o que está no banco no mesmo formato do seu arquivo de exemplo
 * (dadosIA, seriesIA, dadosSaida, recomendacoes, alertas, movimentacoes),
 * para o front só consumir e exibir.
 */
import {
  chaveData,
  somarDias,
  arredondar,
  statusPrazo,
  normalizar,
  categoriaDe,
} from './calculos.js';

const FUSO = 'America/Sao_Paulo';
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function codigoProduto(id) {
  return `P-${String(id).padStart(3, '0')}`;
}

function isoData(data) {
  return new Date(data).toISOString().slice(0, 10);
}

function rotuloDia(iso) {
  const [, mes, dia] = iso.split('-');
  return `${dia}/${mes}`;
}

function horaLocal(data) {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: FUSO,
  });
}

/** "Há 12 min", "Hoje, 08:15", "Ontem, 17:46" ou "21/11, 12:05". */
export function tempoRelativo(data, agora = new Date()) {
  const minutos = Math.floor((agora - new Date(data)) / 60000);
  if (minutos < 1) return 'Agora';
  if (minutos < 60) return `Há ${minutos} min`;

  const hoje = chaveData(agora);
  const dia = chaveData(data);
  if (dia === hoje) return `Hoje, ${horaLocal(data)}`;
  if (somarDias(dia, 1) === hoje) return `Ontem, ${horaLocal(data)}`;
  return `${rotuloDia(dia)}, ${horaLocal(data)}`;
}

/** "Hoje", "Ontem" ou "21 nov". */
function rotuloDataMovimento(data, agora = new Date()) {
  const hoje = chaveData(agora);
  const dia = chaveData(data);
  if (dia === hoje) return 'Hoje';
  if (somarDias(dia, 1) === hoje) return 'Ontem';
  const [, mes, d] = dia.split('-');
  return `${Number(d)} ${MESES[Number(mes) - 1]}`;
}

function formatarMovimentacao(mov, agora) {
  const tipo = normalizar(mov.tipo).startsWith('e') ? 'entrada' : 'saida';
  const origemPadrao =
    tipo === 'entrada'
      ? mov.fornecedor?.nome
        ? `Fornecedor: ${mov.fornecedor.nome}`
        : 'Entrada de estoque'
      : mov.cliente?.nome
        ? `Cliente: ${mov.cliente.nome}`
        : 'Saída de estoque';

  return {
    id: `mov-${mov.id_movimentacao}`,
    dataLabel: rotuloDataMovimento(mov.data_movimento, agora),
    hora: horaLocal(mov.data_movimento),
    produto: mov.produto?.descricao ?? '',
    codigo: codigoProduto(mov.id_produto),
    tipo,
    origem: mov.observacao || origemPadrao,
    documento: `MOV-${mov.id_movimentacao}`,
    quantidade: Number(mov.quantidade),
    unidade: mov.produto?.unidade_medida?.nomenclatura ?? '',
  };
}

/**
 * previsao: registro com include de produtos (periodos, produto) e alertas.
 * movimentacoes: últimas movimentações do banco (não vêm da IA).
 */
export function montarVisao(previsao, movimentacoes = [], agora = new Date()) {
  // dadosIA: uma linha por dia, uma coluna por produto (p<id>)
  const linhas = new Map();
  for (const pp of previsao.produtos) {
    for (const periodo of pp.periodos) {
      const iso = isoData(periodo.data);
      if (!linhas.has(iso)) linhas.set(iso, { data: iso, periodo: rotuloDia(iso) });
      linhas.get(iso)[`p${pp.id_produto}`] = periodo.quantidade;
    }
  }
  const dadosIA = [...linhas.values()].sort((a, b) => a.data.localeCompare(b.data));

  const seriesIA = previsao.produtos.map((pp) => ({
    dataKey: `p${pp.id_produto}`,
    nome: pp.produto.descricao,
    estoqueSeguro: pp.estoque_seguro,
  }));

  const dadosSaida = previsao.produtos.map((pp) => ({
    nome: pp.produto.descricao,
    quantidade: pp.total_previsto,
  }));

  const recomendacoesCompra = previsao.produtos
    .filter((pp) => pp.comprar_qtd > 0)
    .map((pp) => ({
      id: pp.id_produto,
      nome: pp.produto.descricao,
      codigo: codigoProduto(pp.id_produto),
      categoria: categoriaDe(pp.produto),
      estoque: pp.estoque_na_data,
      unidade: pp.produto.unidade_medida?.nomenclatura ?? '',
      mediaDia: arredondar(pp.media_dia, 1),
      coberturaDias: pp.cobertura_dias,
      diasParaComprar: pp.dias_para_comprar,
      statusPrazo: statusPrazo(pp.dias_para_comprar),
      urgente: pp.urgente,
      comprarQtd: pp.comprar_qtd,
      confianca: pp.confianca,
      justificativa: pp.justificativa,
    }))
    .sort((a, b) => {
      if (a.urgente !== b.urgente) return a.urgente ? -1 : 1;
      const da = a.diasParaComprar ?? Infinity;
      const db = b.diasParaComprar ?? Infinity;
      return da - db;
    });

  const ordemSeveridade = { urgente: 0, atencao: 1, informativo: 2 };
  const alertas = [...previsao.alertas]
    .sort(
      (a, b) =>
        (ordemSeveridade[a.severidade] ?? 3) - (ordemSeveridade[b.severidade] ?? 3) ||
        new Date(b.created_at) - new Date(a.created_at)
    )
    .map((a) => ({
      id: String(a.id_alerta),
      titulo: a.titulo,
      severidade: a.severidade,
      descricao: a.descricao,
      tempo: tempoRelativo(a.created_at, agora),
      codigo: codigoProduto(a.id_produto),
      idProduto: a.id_produto,
      lido: a.lido,
    }));

  return {
    previsao: {
      id: previsao.id_previsao,
      horizonteDias: previsao.horizonte_dias,
      geradoEm: previsao.created_at,
      modelo: previsao.modelo,
      localizacao: previsao.localizacao,
      segmento: previsao.segmento,
      contexto: previsao.contexto,
    },
    dadosIA,
    seriesIA,
    dadosSaida,
    recomendacoesCompra,
    alertas,
    movimentacoes: movimentacoes.map((m) => formatarMovimentacao(m, agora)),
  };
}

export default { montarVisao, codigoProduto, tempoRelativo };