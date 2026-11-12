import { prisma } from '../../database.js';

export async function delete_categoria(req, res) {
    const {id_categoria} = req.params
    console.log(id_categoria)
    if(!id_categoria){
        return res.status(400).json({MSG:"Mande o ID de alguma categoria!!"})
    }

    
    try {
        const categoria_existente = await prisma.categoria.findUnique({
            where:{
                id_categoria: Number(id_categoria)
            }
        })
        if(!categoria_existente){
            return res.status(400).json({MSG:"Categoria não encontrada!!"})
        }
        
        const categoria = await prisma.$transaction( async (pris) =>{
            const produto_categoria = await pris.produto_categoria.deleteMany({
                where:{
                    id_categoria: Number(id_categoria)
                }
            })
            const categoria_del = await pris.categoria.delete({
                where:{
                    id_categoria: Number(id_categoria)
                }
            })

        })
        return res.status(200).json({MSG:`Categoria ${categoria_existente.descricao } foi apagado com sucesso`})
       
    } catch (error) {
        console.log(error)
    }
}