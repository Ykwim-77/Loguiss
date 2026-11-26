import { prisma } from '../../database.js';
import { erroHttp } from '../../utils/erros.js';
import { DIAS_HISTORICO } from '../../utils/previsao/constantes.js';
import calc from '../../utils/previsao/calculos.js';

/**
 * Lê produtos, estoque e movimentações do banco e monta o que será enviado à IA:
 * datas do período e, por produto, estoque, estatísticas e histórico de saídas.
 */
export async function montarDadosPrevisao({ horizonteDias, idsProdutos = [], prazoPadraoDias }) {
  const hoje = calc.chaveData();
  const ontem = calc.somarDias(hoje, -1);
  const datasPrevisao = calc.intervaloDias(calc.somarDias(hoje, 1), horizonteDias);
  const diasHistorico = calc.intervaloDias(
    calc.somarDias(ontem, -(DIAS_HISTORICO - 1)),
    DIAS_HISTORICO
  );

  const idsFiltro = idsProdutos.length ? [...new Set(idsProdutos)] : [];

  const produtos = await prisma.produto.findMany({
    where: {
      flag_ativo: 'T',
      estoque: { isNot: null },
      ...(idsFiltro.length ? { id_produto: { in: idsFiltro } } : {}),
    },
    include: {
      estoque: true,
      unidade_medida: true,
      tipo_produto: true,
      categorias: { include: { categoria: true } },
    },
    orderBy: { id_produto: 'asc' },
  });

  if (!produtos.length) {
    throw erroHttp(404, 'Nenhum produto ativo com estoque cadastrado.', 'SEM_PRODUTOS');
  }

  const dataCorteHistorico = new Date(`${diasHistorico[0]}T00:00:00-03:00`);
  const movimentos = await prisma.movimentacao_estoque.findMany({
    where: {
      id_produto: { in: produtos.map((p) => p.id_produto) },
      data_movimento: { gte: dataCorteHistorico },
    },
    select: {
      id_produto: true,
      tipo: true,
      quantidade: true,
      data_movimento: true,
      prazo_chegada: true,
    },
  });

  const porProduto = new Map();
  for (const mov of movimentos) {
    let lista = porProduto.get(mov.id_produto);
    if (!lista) {
      lista = [];
      porProduto.set(mov.id_produto, lista);
    }
    lista.push(mov);
  }

  const entradas = produtos.map((produto) =>
    calc.montarEntradaProduto(produto, porProduto.get(produto.id_produto) ?? [], diasHistorico, prazoPadraoDias)
  );

  return {
    hoje,
    horizonteDias,
    datasPrevisao,
    dataInicioPrevisao: datasPrevisao[0],
    dataFimPrevisao: datasPrevisao[datasPrevisao.length - 1],
    entradas,
  };
}

export default { montarDadosPrevisao };