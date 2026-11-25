/**
 * Funções puras (sem banco e sem IA): datas, estatísticas, validação da resposta
 * da IA e as contas de cobertura e compra. As contas ficam aqui no Node, e não
 * na IA, porque aritmética é exata e a IA pode errar.
 */

import { MAX_ALERTAS_POR_PRODUTO } from './constantes.js';

const FUSO = 'America/Sao_Paulo';
const MS_DIA = 24 * 60 * 60 * 1000;

export const SEVERIDADES = ['urgente', 'atencao', 'informativo'];

// Ajuste aqui se os valores do campo "tipo" da sua movimentacao_estoque forem outros.
const TIPOS_ENTRADA = ['entrada', 'compra', 'e'];
const TIPOS_SAIDA = ['saida', 'venda', 'consumo', 's'];

// ---------- utilidades ----------

export function arredondar(numero, casas = 2) {
  const fator = 10 ** casas;
  return Math.round((Number(numero) + Number.EPSILON) * fator) / fator;
}

export function normalizar(texto) {
  return String(texto ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function media(lista) {
  return lista.length ? lista.reduce((soma, n) => soma + n, 0) / lista.length : 0;
}

// ---------- datas (sempre como texto AAAA-MM-DD, no fuso de São Paulo) ----------

export function chaveData(data = new Date()) {
  return new Date(data).toLocaleDateString('en-CA', { timeZone: FUSO });
}

export function somarDias(chave, dias) {
  const data = new Date(`${chave}T00:00:00Z`);
  data.setUTCDate(data.getUTCDate() + dias);
  return data.toISOString().slice(0, 10);
}

export function intervaloDias(inicio, quantidade) {
  return Array.from({ length: quantidade }, (_, i) => somarDias(inicio, i));
}

function dataOuNull(valor) {
  return typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor) ? valor : null;
}

// ---------- movimentações ----------

export function ehEntrada(tipo) {
  return TIPOS_ENTRADA.includes(normalizar(tipo));
}

export function ehSaida(tipo) {
  return TIPOS_SAIDA.includes(normalizar(tipo));
}

/** Soma as saídas por dia e devolve uma lista alinhada com "dias" (dias sem saída = 0). */
export function serieDiaria(saidas, dias) {
  const porDia = new Map(dias.map((dia) => [dia, 0]));

  for (const saida of saidas) {
    const chave = chaveData(saida.data_movimento);
    if (porDia.has(chave)) {
      porDia.set(chave, porDia.get(chave) + Number(saida.quantidade));
    }
  }

  return dias.map((dia) => arredondar(porDia.get(dia), 3));
}

export function estatisticas(quantidades) {
  const media7 = media(quantidades.slice(-7));
  const media30 = media(quantidades.slice(-30));

  return {
    media_dia_7: arredondar(media7),
    media_dia_30: arredondar(media30),
    tendencia_percentual: media30 > 0 ? Math.round(((media7 - media30) / media30) * 100) : null,
    dias_com_saida: quantidades.filter((q) => q > 0).length,
  };
}

/** Prazo de reposição = média de (prazo_chegada - data_movimento) das entradas. */
export function prazoReposicaoMedio(entradas, padrao) {
  const prazos = entradas
    .filter((e) => e.prazo_chegada)
    .map((e) => Math.ceil((new Date(e.prazo_chegada) - new Date(e.data_movimento)) / MS_DIA))
    .filter((dias) => dias >= 1 && dias <= 60);

  return prazos.length ? Math.max(1, Math.round(media(prazos))) : padrao;
}

// ---------- validação das respostas da IA ----------

export function validarContexto(obj) {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Contexto inválido.');
  }

  const eventos = (Array.isArray(obj.eventos) ? obj.eventos : [])
    .filter((e) => e && typeof e.nome === 'string' && e.nome.trim())
    .map((e) => {
      const impacto = normalizar(e.impacto);
      return {
        nome: e.nome.trim(),
        data_inicio: dataOuNull(e.data_inicio),
        data_fim: dataOuNull(e.data_fim) || dataOuNull(e.data_inicio),
        tipo: typeof e.tipo === 'string' ? e.tipo : null,
        impacto: ['alto', 'medio', 'baixo'].includes(impacto) ? impacto : 'baixo',
        categorias_afetadas: Array.isArray(e.categorias_afetadas)
          ? e.categorias_afetadas.map(String)
          : [],
        confirmado: e.confirmado !== false,
        observacao: typeof e.observacao === 'string' ? e.observacao : null,
      };
    });

  return {
    eventos,
    sazonalidade: typeof obj.sazonalidade === 'string' ? obj.sazonalidade : '',
    fontes: Array.isArray(obj.fontes) ? obj.fontes.filter((f) => typeof f === 'string') : [],
  };
}

/**
 * Confere a resposta da previsão. Se algo essencial faltar, lança erro (e o
 * service tenta de novo). Alertas ruins são apenas descartados.
 */
export function validarPrevisao(obj, { idsEsperados, datasEsperadas }) {
  if (!obj || !Array.isArray(obj.produtos)) {
    throw new Error('A resposta não tem a lista "produtos".');
  }

  const produtos = new Map();

  for (const item of obj.produtos) {
    const id = Number(item?.id_produto);
    if (!idsEsperados.has(id) || produtos.has(id)) continue;

    const quantidades = item.quantidades_por_dia;
    if (!Array.isArray(quantidades) || quantidades.length !== datasEsperadas.length) {
      throw new Error(
        `Produto ${id}: "quantidades_por_dia" deve ter ${datasEsperadas.length} valores.`
      );
    }

    const serie = datasEsperadas.map((data, i) => {
      const quantidade = Number(quantidades[i]);
      if (!Number.isFinite(quantidade) || quantidade < 0) {
        throw new Error(`Produto ${id}: quantidade inválida no dia ${data}.`);
      }
      return { data, quantidade: arredondar(quantidade, 3) };
    });

    const confianca = Number(item.confianca);
    produtos.set(id, {
      serie,
      confianca: Number.isFinite(confianca) ? Math.min(1, Math.max(0, confianca)) : null,
      justificativa:
        typeof item.justificativa === 'string' ? item.justificativa.trim().slice(0, 500) : null,
    });
  }

  const faltando = [...idsEsperados].filter((id) => !produtos.has(id));
  if (faltando.length) {
    throw new Error(`A resposta não trouxe os produtos: ${faltando.join(', ')}.`);
  }

  const alertas = (Array.isArray(obj.alertas) ? obj.alertas : [])
    .map((a) => ({
      id_produto: Number(a?.id_produto),
      severidade: normalizar(a?.severidade),
      titulo: String(a?.titulo ?? '').trim(),
      descricao: String(a?.descricao ?? '').trim(),
    }))
    .filter(
      (a) =>
        idsEsperados.has(a.id_produto) &&
        SEVERIDADES.includes(a.severidade) &&
        a.titulo &&
        a.descricao
    );

  return { produtos, alertas };
}

// ---------- contas de cobertura e compra ----------

export function calcularRecomendacao({ estoque, estoqueSeguro, prazoReposicaoDias, serie, fracionado }) {
  const total = serie.reduce((soma, dia) => soma + dia.quantidade, 0);
  const mediaDia = total / serie.length;

  const coberturaDias = mediaDia > 0 ? estoque / mediaDia : null;
  const diasParaComprar =
    coberturaDias === null ? null : Math.floor(coberturaDias - prazoReposicaoDias);
  const urgente = diasParaComprar !== null && diasParaComprar <= 0;

  const necessario = arredondar(Math.max(0, total + estoqueSeguro - estoque), 3);
  const comprarQtd = fracionado ? Math.ceil(necessario * 10) / 10 : Math.ceil(necessario);

  return {
    total_previsto: arredondar(total, 3),
    media_dia: arredondar(mediaDia, 3),
    cobertura_dias: coberturaDias === null ? null : arredondar(coberturaDias, 1),
    dias_para_comprar: diasParaComprar,
    urgente,
    comprar_qtd: comprarQtd,
  };
}

export function statusPrazo(diasParaComprar) {
  if (diasParaComprar === null || diasParaComprar === undefined) return 'Sem consumo previsto';
  if (diasParaComprar <= 0) return 'Comprar hoje';
  if (diasParaComprar === 1) return 'Em 1 dia';
  return `Em ${diasParaComprar} dias`;
}

/** A IA não pode marcar "urgente" se a regra do Node diz que há cobertura de sobra. */
export function ajustarSeveridade(severidade, urgentePelaRegra) {
  return severidade === 'urgente' && !urgentePelaRegra ? 'atencao' : severidade;
}

function formatarNumero(n) {
  return String(arredondar(n, 1)).replace('.', ',');
}

/** Alerta gerado pelo próprio Node quando a regra aponta ruptura e a IA não avisou. */
export function alertaRuptura({ nome, coberturaDias, prazoReposicaoDias }) {
  return {
    severidade: 'urgente',
    titulo: 'Ruptura próxima',
    descricao:
      `O estoque de ${nome} cobre cerca de ${formatarNumero(coberturaDias)} dias, ` +
      `e o prazo de reposição é de ${prazoReposicaoDias} dia(s). ` +
      'Confirme o saldo físico e o prazo do fornecedor.',
  };
}

// ---------- montagem dos dados e consolidação do resultado ----------

export function categoriaDe(produto) {
  return (
    produto?.categorias?.[0]?.categoria?.descricao ??
    produto?.tipo_produto?.descricao ??
    'Sem categoria'
  );
}

export function dividirEmLotes(lista, tamanho) {
  const lotes = [];
  for (let i = 0; i < lista.length; i += tamanho) lotes.push(lista.slice(i, i + tamanho));
  return lotes;
}

/** Monta o que será enviado à IA para um produto (e usado depois nas contas). */
export function montarEntradaProduto(produto, movimentos, diasHistorico, prazoPadraoDias) {
  const saidas = movimentos.filter((m) => ehSaida(m.tipo));
  const entradas = movimentos.filter((m) => ehEntrada(m.tipo));
  const quantidades = serieDiaria(saidas, diasHistorico);

  return {
    id_produto: produto.id_produto,
    nome: produto.descricao,
    categoria: categoriaDe(produto),
    unidade: produto.unidade_medida?.nomenclatura ?? '',
    fracionado:
      produto.estoque.is_fracionado === 'T' || produto.unidade_medida?.is_fracionado === 'T',
    estoque_atual: Number(produto.estoque.quantidade),
    estoque_seguro: Number(produto.estoque.minimo),
    prazo_reposicao_dias: prazoReposicaoMedio(entradas, prazoPadraoDias),
    estatisticas: estatisticas(quantidades),
    historico_saidas: {
      data_inicial: diasHistorico[0],
      quantidades_por_dia: quantidades,
    },
  };
}

/** Junta a previsão da IA com as contas feitas no Node. */
export function montarLinhas(entradas, previsoes) {
  return entradas.map((entrada) => {
    const previsao = previsoes.get(entrada.id_produto);
    const recomendacao = calcularRecomendacao({
      estoque: entrada.estoque_atual,
      estoqueSeguro: entrada.estoque_seguro,
      prazoReposicaoDias: entrada.prazo_reposicao_dias,
      serie: previsao.serie,
      fracionado: entrada.fracionado,
    });
    return { entrada, previsao, recomendacao };
  });
}

/** Confere a severidade dos alertas da IA pela regra e acrescenta ruptura que a IA não avisou. */
export function consolidarAlertas(linhas, alertasIA) {
  const porProduto = new Map(linhas.map((l) => [l.entrada.id_produto, l]));
  const contagem = new Map();
  const alertas = [];

  for (const alerta of alertasIA) {
    const usados = contagem.get(alerta.id_produto) ?? 0;
    if (usados >= MAX_ALERTAS_POR_PRODUTO) continue;
    contagem.set(alerta.id_produto, usados + 1);

    const { recomendacao } = porProduto.get(alerta.id_produto);
    alertas.push({
      id_produto: alerta.id_produto,
      severidade: ajustarSeveridade(alerta.severidade, recomendacao.urgente),
      titulo: alerta.titulo,
      descricao: alerta.descricao,
    });
  }

  for (const { entrada, recomendacao } of linhas) {
    const jaAvisou = alertas.some(
      (a) => a.id_produto === entrada.id_produto && a.severidade === 'urgente'
    );
    if (recomendacao.urgente && !jaAvisou) {
      alertas.push({
        id_produto: entrada.id_produto,
        ...alertaRuptura({
          nome: entrada.nome,
          coberturaDias: recomendacao.cobertura_dias,
          prazoReposicaoDias: entrada.prazo_reposicao_dias,
        }),
      });
    }
  }

  return alertas;
}

/** Localização e segmento que a IA usa na pesquisa, vindos da tabela empresa. */
export function descreverEmpresa(empresa) {
  const partes = [empresa?.cidade, empresa?.uf].map((p) => String(p ?? '').trim()).filter(Boolean);
  const segmento = String(empresa?.segmento ?? '').trim();

  return {
    localizacao: partes.length ? `${partes.join(', ')}, Brasil` : 'Brasil',
    segmento: segmento || 'comércio de pequeno porte',
    completo: partes.length > 0 && Boolean(segmento),
  };
}

export default {
  SEVERIDADES,
  arredondar,
  normalizar,
  chaveData,
  somarDias,
  intervaloDias,
  ehEntrada,
  ehSaida,
  serieDiaria,
  estatisticas,
  prazoReposicaoMedio,
  validarContexto,
  validarPrevisao,
  calcularRecomendacao,
  statusPrazo,
  ajustarSeveridade,
  alertaRuptura,
  categoriaDe,
  dividirEmLotes,
  montarEntradaProduto,
  montarLinhas,
  consolidarAlertas,
  descreverEmpresa,
};