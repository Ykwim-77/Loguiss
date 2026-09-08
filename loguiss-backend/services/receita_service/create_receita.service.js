import { prisma } from '../../database.js';

export async function create_receita_service(req, res) {
    const {descricao} = req.body

    if(!descricao){
        return res.status(400).json({MSG:"Informe uma descrição para criar uma receita!"}
    )}

    try {
        const receita = await prisma.receita.create({
            data:{
                descricao: descricao
            }
        })

        console.log(receita)

        return res.status(200).json({MSG:`Receita ${receita.id_receita} criada com sucesso!`})
    } catch (error) {
        console.log(error)
    }
}