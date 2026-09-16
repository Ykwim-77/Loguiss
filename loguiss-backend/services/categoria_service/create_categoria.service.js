import { prisma } from '../../database.js';


export async function create_categoria(req, res) {
    const { descricao } = req.body
    if(!descricao){
        return res.status(400).json({MSG:"favor inserir todos os dados corretamente!"})
    }
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