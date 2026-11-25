import { prisma } from '../../database.js';

export async function edit_empresa_service(req, res) {
    try {
        const id = Number(req.params.id_empresa);

        const { nome, cnpj, telefone, email } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                MSG: 'ID da empresa inválido!'
            });
        }

        if (!nome || !cnpj || !telefone || !email) {
            return res.status(400).json({
                MSG: 'Informe nome, CNPJ, telefone e email da empresa!'
            });
        }

        const empresa_existente = await prisma.empresa.findUnique({
            where: { id_empresa: id }
        });

        if (!empresa_existente) {
            return res.status(404).json({
                MSG: 'Empresa não encontrada!'
            });
        }

        const cnpj_duplicado = await prisma.empresa.findFirst({
            where: {
                cnpj,
                NOT: { id_empresa: id }
            }
        });

        if (cnpj_duplicado) {
            return res.status(409).json({
                MSG: 'Já existe outra empresa com esse CNPJ!'
            });
        }

        const email_duplicado = await prisma.empresa.findFirst({
            where: {
                email,
                NOT: { id_empresa: id }
            }
        });

        if (email_duplicado) {
            return res.status(409).json({
                MSG: 'Já existe outra empresa com esse email!'
            });
        }

        const empresa = await prisma.empresa.update({
            where: { id_empresa: id },
            data: {
                nome,
                cnpj,
                telefone,
                email
            }
        });

        return res.status(200).json({
            MSG: 'Empresa atualizada com sucesso!',
            empresa
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            MSG: 'Erro ao atualizar empresa!'
        });
    }
}