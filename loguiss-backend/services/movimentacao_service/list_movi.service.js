import { prisma } from "../../database.js";

export default async function list_movimentacao_service(req, res) {
    const tipo = req.params.Tipo_movi

    if(tipo == 'S'){
        try {
            const movimentacoes = await prisma.movimentacao_estoque.findMany({
                where:{
                    tipo: tipo
                },
                include:{
                    produto: true,
                    cliente: true
                }
            })
            return res.status(200).json({MSG: "movimentacoes retornadas com sucesso!", movimentacoes: movimentacoes})
        } catch (error) {
            console.log(error)
        }

    }else if( tipo == 'E' ){
        try {
            const movimentacoes = await prisma.movimentacao_estoque.findMany({
                where:{
                    tipo: tipo
                },
                include:{
                    produto: true,
                    fornecedor: true
                }
            })
            return res.status(200).json({MSG: "movimentacoes retornadas com sucesso!", movimentacoes: movimentacoes})
        } catch (error) {
            console.log(error)
        }


    }else{
        return res.status(400).json({MSG: "Tipo de movimentação inválida!"})
    }






    
    
}