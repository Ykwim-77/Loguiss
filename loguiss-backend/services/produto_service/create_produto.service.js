import { prisma } from '../../database.js';
import { link_receita_produto } from '../receita_produto_service/link_receita_produto.service.js'; 
import { link_categoria_produto } from '../categoria_produto_service/link_categoria_produto.service.js';
import link_fornecedor_produto_service from '../fornecedor_service/link_fornecedor_produto.service.js';
import create_estoque_service from '../estoque_service/create_entoque.service.js';


export async function create_produto_service(req, res) {
    let { descricao, 
        id_tipo_produto, 
        id_unidade_medida, 
        is_fracionado, 
        valor, 
        flag_ativo,
        id_categoria_user,
        id_receita,
        id_fornecedor_user,
        quantidade,
        dt_entrada,
        minimo,
        prazo_saida } = req.body


    let campos_obrigatorios = [
        descricao, 
        id_tipo_produto, 
        id_unidade_medida, 
        valor,
        id_receita,
        id_categoria_user,
        id_fornecedor_user,
        quantidade,
        dt_entrada,
        minimo,
        prazo_saida]

    if(campos_obrigatorios.some(campo => campo === "")){ // vai verificar se existe algum campo vazio na lista de obrigatórios
        return res.status(400).json({MSG: "Algum campo está faltando, por favor verifique!!"})
    }
    try {
        id_tipo_produto = Number(id_tipo_produto);
        id_unidade_medida = Number(id_unidade_medida);
        id_categoria_user = Number(id_categoria_user);
        id_fornecedor_user = Number(id_fornecedor_user);

        const existe_fornecedor = await prisma.fornecedor.findUnique({
            where:{
                id_fornecedor: id_fornecedor_user
            }
        })
        const existe_categoria = await prisma.categoria.findUnique({
            where:{
                id_categoria: id_categoria_user
            }
        })

        if(!existe_fornecedor){
            return res.status(400).json({MSG: "favor informar um fornecedor válido!"})
        }

        if(!existe_categoria){
            return res.status(400).json({MSG: "favor informar uma categoria válida!"})
        }
        
        const produto = await prisma.produto.create({
            data:{
                descricao: descricao,
                valor: valor,
                unidade_medida:{
                    connect:{
                        id_unidade: id_unidade_medida
                    }
                },
                tipo_produto:{
                    connect:{
                        id_tipo_produto: id_tipo_produto
                    }
                }
            },
            include:{
                categorias: true,
                fornecedores: {
                    include: {
                        fornecedor: true
                    }
                },
                unidade_medida: true
            }
        })
        const id_produto = produto.id_produto
        const id_categoria = id_categoria_user
        
        const object_link = await link_categoria_produto(id_categoria, id_produto);
        console.log(object_link)

        const link_fornecedor_produto = await link_fornecedor_produto_service(quantidade, id_fornecedor_user, id_produto, req, res)
        console.log(link_fornecedor_produto)


        const link_estoque_produto = await create_estoque_service(dt_entrada, id_produto, is_fracionado, minimo, prazo_saida, quantidade)
        console.log("estoque criada e vinculado!", link_estoque_produto)


        return res.status(200).json({MSG:"produto criado com sucesso!!", produto: produto})
    } catch (error) {
        console.log(error)
    }
}