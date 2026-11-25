import { prisma } from '../../database.js';

export async function edit_unidade_service(req, res) {
    try {
        const id = Number(req.params.id_unidade);

        const {
            descrunidade,
            gramatura,
            is_fracionado,
            nomenclatura
        } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                MSG: 'ID da unidade inválido!'
            });
        }

        if (!descrunidade || !nomenclatura) {
            return res.status(400).json({
                MSG: 'Informe a descrição e a nomenclatura!'
            });
        }

        const unidade_existente = await prisma.unidade_medida.findUnique({
            where: { id_unidade: id }
        });

        if (!unidade_existente || unidade_existente.flag_ativo !== 'T') {
            return res.status(404).json({
                MSG: 'Unidade não encontrada!'
            });
        }

        const descricao_duplicada = await prisma.unidade_medida.findFirst({
            where: {
                descrunidade,
                flag_ativo: 'T',
                NOT: { id_unidade: id }
            }
        });

        if (descricao_duplicada) {
            return res.status(409).json({
                MSG: 'Já existe outra unidade com essa descrição!'
            });
        }

        const unidade = await prisma.unidade_medida.update({
            where: { id_unidade: id },
            data: {
                descrunidade,
                gramatura: gramatura || null,
                is_fracionado: is_fracionado || null,
                nomenclatura
            }
        });

        return res.status(200).json({
            MSG: 'Unidade atualizada com sucesso!',
            unidade
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            MSG: 'Erro ao atualizar unidade!'
        });
    }
}
