import { prisma } from "../../database.js";

export default async function list_categoria_service(req, res) {
    try {
        const categorias = await prisma.categoria.findMany({
            where:{
                flag_ativo:"T"
            }
        });
        if(!categorias){
            return res.status(400).json({MSG:"nenhuma categoria encontrada!"})
        }
        return res.status(200).json({MSG:"categorias encontradas!!", categorias: categorias})
    } catch (error) {
        console.log(error)
    }
}