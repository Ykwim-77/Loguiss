import { prisma } from "../../database.js";

export default async function link_fornecedor_produto_service(quantidade, id_fornecedor, id_produto, req, res) {
    if(!id_fornecedor || !id_produto){
        return res.status(400).json({MSG: "alguma informação faltando! Favor verificar!"})
    }
    try {
        id_fornecedor = Number(id_fornecedor);
        id_produto = Number(id_produto);

        const link_fornecedor_produto = await prisma.fornecedor_produto.create({
            data:{
                quantidade: quantidade,
                produto:{
                    connect:{
                        id_produto: id_produto
                    }
                },
                fornecedor:{
                    connect:{
                        id_fornecedor: id_fornecedor
                    }
                }
            }
            
        })

        return link_fornecedor_produto
    } catch (error) {
        console.log(error)
    }
}