import { prisma } from '../../database.js';

export async function listar_producoes_service(req, res) {
    try {
        const producoes = await prisma.producao.findMany({
            orderBy: { data_producao: 'desc' },
            include: {
                produto: {
                    select: {
                        id_produto: true,
                        descricao: true,
                        unidade_medida: true,
                    },
                },
                movimentacoes: {
                    include: {
                        produto: {
                            select: {
                                id_produto: true,
                                descricao: true,
                                unidade_medida: true,
                            },
                        },
                    },
                    orderBy: { id_movimentacao: 'asc' },
                },
            },
        });

        return res.status(200).json({
            MSG: 'Histórico de produção carregado com sucesso.',
            producoes,
        });
    } catch (error) {
        console.error('Erro ao listar produções:', error);
        return res.status(500).json({ MSG: 'Erro ao carregar histórico de produção.' });
    }
}
