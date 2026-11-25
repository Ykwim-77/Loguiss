
import { prisma } from '../../database.js';

export async function Delete_unidade(req, res) {
    try {
        const id = Number(req.params.id_unidade);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                MSG: 'ID da unidade inválido!'
            });
        }

        const unidade_existente = await prisma.unidade_medida.findUnique({
            where: { id_unidade: id }
        });

        if (!unidade_existente || unidade_existente.flag_ativo !== 'T') {
            return res.status(404).json({
                MSG: 'Unidade não encontrada ou já desativada!'
            });
        }

        await prisma.unidade_medida.update({
            where: { id_unidade: id },
            data: {
                flag_ativo: 'F'
            }
        });

        return res.status(200).json({
            MSG: 'Unidade desativada com sucesso!'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            MSG: 'Erro ao desativar unidade!'
        });
    }
}
