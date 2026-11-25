import { prisma } from '../../database.js';
import { montarVisao } from '../../utils/previsao/formatador.js';

/** Lê do banco (sem chamar a IA). Sem filtros, devolve a previsão mais recente. */
export async function buscarPrevisao({ id, horizonteDias } = {}) {
  const previsao = await prisma.previsao.findFirst({
    where: {
      ...(id ? { id_previsao: id } : {}),
      ...(horizonteDias ? { horizonte_dias: horizonteDias } : {}),
    },
    orderBy: { created_at: 'desc' },
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
  });

  if (!previsao) return null;

  const movimentacoes = await prisma.movimentacao_estoque.findMany({
    orderBy: { data_movimento: 'desc' },
    take: 10,
    include: {
      produto: { include: { unidade_medida: true } },
      cliente: { select: { nome: true } },
      fornecedor: { select: { nome: true } },
    },
  });

  return montarVisao(previsao, movimentacoes);
}

export default { buscarPrevisao };