import { prisma } from "../../database.js";

export async function edit_fornecedor_service(req, res) {
    const {
        email,
        nome,
        telefone,
        bairro,
        estado,
        numero,
        rua
    } = req.body ?? {};

    const idNum = Number(req.params?.id_fornecedor ?? req.params?.id);

    if (!Number.isInteger(idNum) || idNum <= 0) {
        return res.status(400).json({ MSG: "ID do fornecedor inválido!" });
    }

    try {
        const existe_fornecedor = await prisma.fornecedor.findUnique({
            where: {
                id_fornecedor: idNum
            }
        });

        if (!existe_fornecedor) {
            return res.status(400).json({
                MSG: "Fornecedor não encontrado ou não existe!"
            });
        }

        const fornecedorAtualizado = await prisma.$transaction(async (tx) => {
            if (existe_fornecedor.id_endereco) {
                await tx.endereco.update({
                    where: {
                        id_endereco: existe_fornecedor.id_endereco
                    },
                    data: {
                        ...(bairro !== undefined ? { bairro } : {}),
                        ...(numero !== undefined ? { numero: String(numero) } : {}),
                        ...(rua !== undefined ? { rua } : {}),
                        ...(estado !== undefined ? { estado } : {}),
                    }
                });
            } else if (rua || bairro || numero || estado) {
                const novoEndereco = await tx.endereco.create({
                    data: {
                        rua: rua ?? "",
                        bairro: bairro ?? "",
                        numero: numero !== undefined ? String(numero) : "",
                        estado: estado ?? "",
                    }
                });

                await tx.fornecedor.update({
                    where: { id_fornecedor: idNum },
                    data: { id_endereco: novoEndereco.id_endereco }
                });
            }

            return tx.fornecedor.update({
                where: {
                    id_fornecedor: idNum
                },
                data: {
                    ...(email !== undefined ? { email } : {}),
                    ...(nome !== undefined ? { nome } : {}),
                    ...(telefone !== undefined ? { telefone } : {}),
                },
                include: {
                    endereco: true
                }
            });
        });

        return res.status(200).json({
            MSG: "Fornecedor editado!!",
            fornecedor: fornecedorAtualizado
        });
    } catch (error) {
        console.log("Erro ao editar fornecedor:", error);
        return res.status(500).json({
            MSG: "Erro ao editar fornecedor."
        });
    }
}