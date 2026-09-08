import { prisma } from '../../database.js';

export async function edit_receita_service(req, res) {
    let {descricao, id_receita} = req.body

    if(!descricao || !id_receita){
        return res.status(400).json({MSG:"Informe todos os dados necessário para fazer a edição de receita!"})
    }
    

    try {
        id_receita = Number(id_receita)
        const receita = await prisma.receita.update({
            where:{
                id_receita: id_receita
            },
            data:{
                descricao: descricao
            }
        })
        return res.status(200).json({MSG: "Receita atualizada com sucesso!", receita: receita})
    } catch (error) {
        console.log(error)
    }



}