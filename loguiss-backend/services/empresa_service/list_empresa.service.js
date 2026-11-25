import { prisma } from '../../database.js';

export default async function list_empresa_service(req, res) {
    try {
        const empresas = await prisma.empresa.findMany({});

        if (empresas.length === 0) {
            return res.status(404).json({
                MSG: 'Nenhuma empresa encontrada!'
            });
        }

        return res.status(200).json({
            MSG: 'Empresas encontradas!',
            empresas
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            MSG: 'Erro ao listar empresas!'
        });
    }
}