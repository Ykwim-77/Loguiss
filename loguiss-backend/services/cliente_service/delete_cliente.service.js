import { prisma } from "../../database.js";

export default async function delete_cliente_service(req, res) {
    const id_cliente = Number(req.params.id_cliente)

    if(!id_cliente){
        return res.status(400).json({MSG: "É necessário enviar o ID de algum cliente!"})
    }

    try {
        const cliente_existente = await prisma.cliente.findUnique({
            where:{
                id_cliente: id_cliente
            }
        })
        if(!cliente_existente){
            return res.status(404).json({MSG: "Cliente não existe!"})
        }
        const cliente = prisma.$transaction(async (pris) =>{

            const cliente_delete = await pris.cliente.delete({
                where:{
                    id_cliente: id_cliente
                }
            })

        })
        return res.status(200).json({MSG: "Cliente deletado com sucesso!", cliente: cliente_existente})


    } catch (error) {
        console.log(error)
    }


}