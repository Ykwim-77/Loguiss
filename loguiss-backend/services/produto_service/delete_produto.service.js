import { prisma } from '../../database.js';

export async function delete_produto_service(req, res) {
    const { id_produto } = req.params;

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

        if (produto.flag_ativo === 'F') {
            return res.status(400).json({
                MSG: 'Este produto já está desativado!'
            });
        }

        await prisma.produto.update({
            where: {
                id_produto: id
            },
            data: {
                flag_ativo: 'F'
            }
        });

        return res.status(200).json({
            MSG: 'Produto desativado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao desativar produto:', error);

        return res.status(500).json({
            MSG: 'Erro ao desativar produto!'
        });
    }
}