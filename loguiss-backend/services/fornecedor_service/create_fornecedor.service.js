import {prisma} from "../../database.js";
import link_endereco_service from "../endereco_service/link_endereco.service.js";

export default async function create_fornecedor_service(req, res) {
    const{
        cnpj,
        email,
        nome,
        telefone,
        bairro,
        estado,
        numero,
        rua
    } = req.body

    if(!cnpj || !email || !nome || !telefone){
        return res.status(400).json({MSG: "Algum dado faltante, favor conferir!!"})
    }

    try {

        const cnpj_fornecedor = await prisma.fornecedor.findUnique({
            where:{
                cnpj: cnpj
            }
        })
        if(cnpj_fornecedor == null){
            const id_endereco_create = await link_endereco_service( bairro, estado, numero, rua);
            const fornecedor = await prisma.fornecedor.create({
                data:{
                    cnpj: cnpj,
                    email: email,
                    id_endereco: id_endereco_create,
                    nome: nome,
                    telefone: telefone
                },
                include:{
                    endereco: id_endereco_create
                }
            })
        
            return res.status(200).json({MSG: "Fornecedor criado com sucesso!", fornecedor: fornecedor})
        }
        else{
            return res.status(400).json({MSG:"CNPJ informado já cadastrado!", cnpj: cnpj})
        }
        
    } catch (error) {
        console.log(error)
    }
}