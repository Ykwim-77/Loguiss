import { prisma } from '../../database.js';
import { montarVisao } from '../../utils/previsao/formatador.js';

function calcularDiasParaProximaReposicao(produtosPrevisao = []) {
  let menorDias = null;

  for (const item of produtosPrevisao) {
    const candidatos = [item?.dias_para_comprar, item?.cobertura_dias]
      .map((v) => (v === null || v === undefined ? null : Number(v)))
      .filter((n) => n !== null && Number.isFinite(n) && n >= 0);

    if (candidatos.length > 0) {
      const menorDoProduto = Math.min(...candidatos);
      if (menorDias === null || menorDoProduto < menorDias) {
        menorDias = menorDoProduto;
      }
    }
  }

  return menorDias;
}

/** Lê do banco (sem chamar a IA); a maior chave identifica a previsão inserida mais recentemente. */
export async function buscarPrevisao({ id, horizonteDias } = {}) {
  const agora = new Date();
  const [previsao, movimentacoes] = await Promise.all([
    prisma.previsao.findFirst({
      where: {
        ...(id ? { id_previsao: id } : {}),
        ...(horizonteDias ? { horizonte_dias: horizonteDias } : {}),
      },
      orderBy: { id_previsao: 'desc' },
      include: {
        produtos: {
          orderBy: { id_produto: 'asc' },
          include: {
            periodos: { orderBy: { data: 'asc' } },
            produto: {
              include: {
                unidade_medida: true,
                tipo_produto: true,
                categorias: { include: { categoria: true } },
              },
            },
          },
        },
        alertas: true,
      },
    }),
    prisma.movimentacao_estoque.findMany({
      where: { data_movimento: { lte: agora } },
      orderBy: [{ data_movimento: 'desc' }, { id_movimentacao: 'desc' }],
      take: 10,
      include: {
        produto: { include: { unidade_medida: true } },
        cliente: { select: { nome: true } },
        fornecedor: { select: { nome: true } },
      },
    }),
  ]);

  if (!previsao) return null;

  const visao = montarVisao(previsao, movimentacoes);
  const diasParaProximaReposicao = calcularDiasParaProximaReposicao(previsao.produtos);

  return {
    ...visao,
    diasParaProximaReposicao,
  };
}

export default { buscarPrevisao };