import { prisma } from "../../database.js"

export default async function create_estoque_service(dt_entrada, id_produto, is_fracionado, minimo, prazo_saida, quantidade) {
    if(!dt_entrada || !id_produto || !is_fracionado || !minimo || !prazo_saida || ! quantidade){
        return console.log("algum dado faltante, favor conferir!")
    }
    try {
        const estoque = await prisma.estoque.create({
            data:{
                dt_entrada: dt_entrada,
                is_fracionado: is_fracionado,
                minimo: minimo,
                prazo_saida: prazo_saida,
                quantidade: quantidade,

                produto:{
                    connect:{
                        id_produto: id_produto
                    }
                }
            }
        })
        return estoque
    } catch (error) {
        console.log(error)
    }
}