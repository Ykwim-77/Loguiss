import { prisma } from '../../database.js';


export async function edit_categoria(req, res){
    const {descricao, status, id_categoria} = req.body;

    if(!descricao || !status){
        return res.status(400).json({MSG: "Para editar precisa mandar pelo menos um parâmetro!!"})
    }
    if(!id_categoria){
        return res.status(400).json({MSG: "Para editar precisa mandar pelo menos o id_categoria!!"})
    }

    try{
        const categoria = await prisma.categoria.update({
            where:{
                id_categoria: id_categoria
            },
            data:{
                descricao: descricao,
                flag_ativo: status
            }
        })
        console.log(categoria)
        
        return res.status(200).json({MSG: "categoria criada com sucesso!!", categoria: categoria})
    }catch(error){
        console.log(error)
    }


}