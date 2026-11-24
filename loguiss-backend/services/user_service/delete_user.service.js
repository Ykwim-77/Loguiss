import { prisma } from "../../database.js";

export default async function delete_user_service(req, res) {
    const id_user = Number(req.params.id_user)

    try {

        const existe_user = await prisma.user.findFirst({
            where:{
                id_user: id_user
            }
        })
        if(!existe_user){
            return res.status(404).json({MSG: "Cliente não encontrado! favor inserir um ID válido"})
        }
        await prisma.user.update({
            where:{
                id_user: id_user
            },
            data:{
                flag_ativo: "F"
            }
        })

        return res.status(200).json({MSG: "usuário deletado com sucesso!", user: existe_user})



    } catch (error) {
        return res.status(500).json({MSG: "erro para deletar usuário!", error: error})
    }
    
}