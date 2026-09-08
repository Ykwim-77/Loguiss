import { prisma } from "../../database.js";

export default async function list_unidade_service(req, res) {
    try {
        const unidades = await prisma.unidade_medida.findMany({
            where:{
                flag_ativo: "T"
            }
        })
        if(!unidades){
            return res.status(400).json({MSG:"Não foram encontradas unidades de medida!!"})
        }
        return res.status(200).json({MSG: "Unidades de medida encontrados!!", unidades: unidades})
    } catch (error) {
        console.log(error)
    }
}