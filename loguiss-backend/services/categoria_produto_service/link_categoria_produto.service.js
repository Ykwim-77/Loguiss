import { prisma } from '../../database.js';

export async function link_categoria_produto(id_categoria, id_produto) {
    /**
     * @param [id_categoria] && [id_produto]
     * faz a vinculação na tabela categoria produto
     * retorna se deu certo com um object da vinculação
     */
    try {
        const link = await prisma.produto_categoria.create({
            data:{
                produto:{
                    connect:{
                        id_produto: id_produto
                    }
                },
                categoria:{
                    connect:{
                        id_categoria: id_categoria
                    }
                }
            }
        })


        return link
    } catch (error) {
        console.log(error)
    }
    


}