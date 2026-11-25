import { prisma } from '../../database.js';

export async function edit_produto_service(req, res) {
    const { id_produto } = req.params;

    const {
        descricao,
        id_tipo_produto,
        id_unidade_medida,
        valor,
        flag_ativo
    } = req.body;

    try {
        const id = Number(id_produto);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                MSG: 'ID do produto inválido!'
            });
        }

        const produto = await prisma.produto.findUnique({
            where: {
                id_produto: id
            }
        });

        if (!produto) {
            return res.status(404).json({
                MSG: 'Produto não encontrado!'
            });
        }

        const produto_atualizado = await prisma.produto.update({
            where: {
                id_produto: id
            },
            data: {
                descricao,
                id_tipo_produto,
                id_unidade_medida,
                valor,
                flag_ativo
            }
        });

        return res.status(200).json({
            MSG: 'Produto atualizado com sucesso!',
            produto: produto_atualizado
        });

    } catch (error) {
        console.error('Erro ao editar produto:', error);

        return res.status(500).json({
            MSG: 'Erro ao atualizar produto!'
        });
    }
}