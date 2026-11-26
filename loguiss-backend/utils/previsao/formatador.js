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

const formatadorHora = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: FUSO,
});

export function codigoProduto(id) {
  return `P-${String(id).padStart(3, '0')}`;
}

function isoData(data) {
  return (data instanceof Date ? data : new Date(data)).toISOString().slice(0, 10);
}

function rotuloDia(iso) {
  const [, mes, dia] = iso.split('-');
  return `${dia}/${mes}`;
}

function horaLocal(data) {
  return formatadorHora.format(data instanceof Date ? data : new Date(data));
}

export function tempoRelativo(data, agora = new Date()) {
  const dataObj = data instanceof Date ? data : new Date(data);
  const agoraObj = agora instanceof Date ? agora : new Date(agora);
  const minutos = Math.floor((agoraObj - dataObj) / 60000);
  if (minutos < 1) return 'Agora';
  if (minutos < 60) return `Há ${minutos} min`;

  const hoje = chaveData(agoraObj);
  const dia = chaveData(dataObj);
  if (dia === hoje) return `Hoje, ${horaLocal(dataObj)}`;
  if (somarDias(dia, 1) === hoje) return `Ontem, ${horaLocal(dataObj)}`;
  return `${rotuloDia(dia)}, ${horaLocal(dataObj)}`;
}

function rotuloDataMovimento(data, agora = new Date()) {
  const dataObj = data instanceof Date ? data : new Date(data);
  const agoraObj = agora instanceof Date ? agora : new Date(agora);
  const hoje = chaveData(agoraObj);
  const dia = chaveData(dataObj);
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

export function montarVisao(previsao, movimentacoes = [], agora = new Date()) {
  const linhas = new Map();
  const seriesIA = [];
  const dadosSaida = [];
  const recomendacoesRaw = [];
  const produtosPrevisao = [];

  for (const pp of previsao.produtos) {
    const chaveProd = `p${pp.id_produto}`;
    const nomeProd = pp.produto.descricao;
    const unidadeProd = pp.produto.unidade_medida?.nomenclatura ?? '';
    const categoria = categoriaDe(pp.produto);
    const serie = pp.periodos.map((periodo) => ({
      data: isoData(periodo.data),
      quantidade: periodo.quantidade,
    }));

    for (const periodo of serie) {
      const iso = periodo.data;
      let linha = linhas.get(iso);
      if (!linha) {
        linha = { data: iso, periodo: rotuloDia(iso) };
        linhas.set(iso, linha);
      }
      linha[chaveProd] = periodo.quantidade;
    }

    produtosPrevisao.push({
      id: pp.id_produto,
      nome: nomeProd,
      codigo: codigoProduto(pp.id_produto),
      categoria,
      unidade: unidadeProd,
      estoque: pp.estoque_na_data,
      estoqueSeguro: pp.estoque_seguro,
      prazoReposicaoDias: pp.prazo_reposicao_dias,
      mediaDia: pp.media_dia,
      totalPrevisto: pp.total_previsto,
      confianca: pp.confianca,
      justificativa: pp.justificativa,
      coberturaDias: pp.cobertura_dias,
      diasParaComprar: pp.dias_para_comprar,
      urgente: pp.urgente,
      comprarQtd: pp.comprar_qtd,
      serie,
    });

    seriesIA.push({
      dataKey: chaveProd,
      nome: nomeProd,
      estoqueSeguro: pp.estoque_seguro,
    });

    dadosSaida.push({
      nome: nomeProd,
      quantidade: pp.total_previsto,
    });

    if (pp.comprar_qtd > 0) {
      recomendacoesRaw.push({
        id: pp.id_produto,
        nome: nomeProd,
        codigo: codigoProduto(pp.id_produto),
          categoria,
        estoque: pp.estoque_na_data,
        unidade: unidadeProd,
        mediaDia: arredondar(pp.media_dia, 1),
        coberturaDias: pp.cobertura_dias,
        diasParaComprar: pp.dias_para_comprar,
        statusPrazo: statusPrazo(pp.dias_para_comprar),
        urgente: pp.urgente,
        comprarQtd: pp.comprar_qtd,
        confianca: pp.confianca,
        justificativa: pp.justificativa,
      });
    }
  }

  const dadosIA = [...linhas.values()].sort((a, b) => a.data.localeCompare(b.data));

  const recomendacoesCompra = recomendacoesRaw.sort((a, b) => {
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

  const respostasIA = Array.isArray(previsao.resposta_bruta?.lotes)
    ? previsao.resposta_bruta.lotes
    : [];

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
    respostasIA,
    dadosIA,
    seriesIA,
    dadosSaida,
    produtosPrevisao,
    recomendacoesCompra,
    alertas,
    movimentacoes: movimentacoes.map((m) => formatarMovimentacao(m, agora)),
  };
}

export default { montarVisao, codigoProduto, tempoRelativo };