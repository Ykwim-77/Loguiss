import { prisma } from '../../database.js';
import { validar_conversao_unidade } from './validar_conversao_unidade.js';

export async function create_unidade_service(req, res) {
    try {
        const {
            descrunidade,
            gramatura,
            is_fracionado,
            nomenclatura,
            dimensao_conversao,
            fator_conversao,
        } = req.body;

        if (!descrunidade || !nomenclatura) {
            return res.status(400).json({
                MSG: 'Informe a descrição e a nomenclatura da unidade!'
            });
        }

        const conversao = validar_conversao_unidade(dimensao_conversao, fator_conversao);
        if (conversao.erro) {
            return res.status(400).json({ MSG: conversao.erro });
        }

        const unidade_existente = await prisma.unidade_medida.findFirst({
            where: {
                descrunidade,
                flag_ativo: 'T'
            }
        });

        if (unidade_existente) {
            return res.status(409).json({
                MSG: 'Já existe uma unidade com essa descrição!'
            });
        }

        const unidade = await prisma.unidade_medida.create({
            data: {
                descrunidade,
                gramatura: gramatura || null,
                is_fracionado: is_fracionado || null,
                nomenclatura,
                ...conversao.dados,
                flag_ativo: 'T'
            }
        });

        return res.status(201).json({
            MSG: 'Unidade cadastrada com sucesso!',
            unidade
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            MSG: 'Erro ao cadastrar unidade!'
        });
    }
}
