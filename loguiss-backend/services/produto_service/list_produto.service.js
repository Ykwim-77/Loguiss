import { prisma } from '../../database.js';

export default async function list_produto_service(req, res) {
    try {
        const produtos = await prisma.produto.findMany({
            include:{
                categorias:{
                    include:{
                        categoria: true
                    }
                }
                
            }
        })
        return res.status(200).json({MSG: "produtos encontrados!!", produtos: produtos})
    } catch (error) {
        console.log(error)
    }
    
}