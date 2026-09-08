import { prisma } from "../../database.js";

export default async function list_fornecedor_service(req, res) {
    try{
        const fornecedores = await prisma.fornecedor.findMany({})

        if(!fornecedores){
            return res.status(400).json({MSG: "nenhum fornecedor encontrado!"})
        }
        return res.status(200).json({MSG:"fornecedores encontrados!", fornecedores: fornecedores})
    }catch(error){
        console.log(error)
    }
}