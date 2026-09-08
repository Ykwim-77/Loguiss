import { prisma } from '../../database.js';


export async function create_categoria(req, res) {
    const { descricao } = req.body
    console.log(descricao)
    try{
       const categoria = await prisma.categoria.create({
            data:{
                descricao: descricao
            }
        })
        console.log(categoria)

    return res.status(201).json({MSG: "categoria criada com sucesso!!"})
    }catch(error){
        console.log(error)
    }
    
    
    
}