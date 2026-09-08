import { prisma } from "../../database.js";

export default async function link_endereco_service(bairro, estado, numero, rua) {
    try {
        const endereco_novo = await prisma.endereco.create({
            data:{
                bairro: bairro,
                estado: estado,
                numero: numero,
                rua: rua
            }
        })
        return endereco_novo.id_endereco
    } catch (error) {
        console.log(error)
    }
    
}