import { prisma } from '../../database.js';

export async function delete_categoria(req, res) {
    let {id_categoria} = req.body;
    if(!id_categoria){
        return res.status(400).json({MSG:"Mande o ID de alguma categoria!!"})
    }

    id_categoria = Number(id_categoria)
    
    try {
        const categoria_existente = await prisma.categoria.findUnique({
            where:{
                id_categoria: id_categoria
            }
        })
        if(!categoria_existente){
            return res.status(400).json({MSG:"Categoria não encontrada!!"})
        }
        
        const categoria = await prisma.categoria.delete({
            where:{
                id_categoria:id_categoria
            }
        })
        
        return res.status(200).json({MSG:`Categoria ${categoria} foi apagado com sucesso`})
       
    } catch (error) {
        console.log(error)
    }
}