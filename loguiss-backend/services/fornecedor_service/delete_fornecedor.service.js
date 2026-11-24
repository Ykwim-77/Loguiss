import { prisma } from "../../database.js";

export async function delete_fornecedor_service(req, res) {
    const id_fornecedor = req.params.id_fornecedor

    try {
        const existe_fornecedor = await prisma.fornecedor.findUnique({
            where:{
                id_fornecedor: Number(id_fornecedor)
            }
        }) 
        if(!existe_fornecedor){
            return res.status(400).json({MSG: "Fornecedor não encontrado ou não existe! favor verificar!"})
        }

        const fornecedor = await prisma.fornecedor.update({
            where:{
                id_fornecedor: Number(id_fornecedor)
            },
            data:{
                flag_ativo: "F"
            }
        })
        
        return res.status(200).json({MSG:"Fornecedor deletado com sucesso!", fornecedor: existe_fornecedor})

    } catch (error) {
        console.log(error)
    }

}