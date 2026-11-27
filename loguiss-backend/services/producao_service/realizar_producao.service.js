import { Prisma } from '@prisma/client';

import { prisma } from '../../database.js';
import { calcular_quantidade_ingrediente } from './calcular_quantidade_ingrediente.js';

const includeProducao = {
    produto: {
        select: {
            id_produto: true,
            descricao: true,
            unidade_medida: true,
        },
    },
    movimentacoes: {
        include: {
            produto: {
                select: {
                    id_produto: true,
                    descricao: true,
                    unidade_medida: true,
                },
            },
        },
        orderBy: { id_movimentacao: 'asc' },
    },
};

class EstoqueAlteradoError extends Error {
    constructor(faltantes) {
        super('O estoque foi alterado durante a produção.');
        this.faltantes = faltantes;
    }
}

function converterDecimal(valor) {
    if (valor instanceof Prisma.Decimal) {
        return valor.isFinite() ? valor : null;
    }

    if (typeof valor !== 'number' && typeof valor !== 'string') return null;
    if (String(valor).trim() === '') return null;

    try {
        const decimal = new Prisma.Decimal(valor);
        return decimal.isFinite() ? decimal : null;
    } catch {
        return null;
    }
}

function montarFalta(ingrediente, disponivel, necessario) {
    return {
        id_produto: ingrediente.id_produto,
        ingrediente: ingrediente.produto.descricao,
        disponivel: disponivel.toString(),
        necessario: necessario.toString(),
        faltante: Prisma.Decimal.max(necessario.minus(disponivel), 0).toString(),
    };
}

function mesmaRequisicao(producao, idProduto, quantidade) {
    return producao.id_produto === idProduto && new Prisma.Decimal(producao.quantidade).eq(quantidade);
}

export async function realizar_producao_service(req, res) {
    const body = req.body ?? {};
    const idProduto = Number(body.id_produto);
    const quantidadeProduzida = converterDecimal(body.quantidade);
    const chaveIdempotencia =
        typeof body.chave_idempotencia === 'string'
            ? body.chave_idempotencia.trim()
            : body.chave_idempotencia;

    if (!Number.isInteger(idProduto) || idProduto <= 0) {
        return res.status(400).json({ MSG: 'Selecione um produto de produção válido.' });
    }

    if (!quantidadeProduzida?.gt(0)) {
        return res.status(400).json({ MSG: 'Informe uma quantidade de produção maior que zero.' });
    }

    if (
        typeof chaveIdempotencia !== 'string' ||
        chaveIdempotencia.trim().length < 8 ||
        chaveIdempotencia.length > 128
    ) {
        return res.status(400).json({ MSG: 'A chave de idempotência da produção é inválida.' });
    }

    try {
        const resultado = await prisma.$transaction(async (tx) => {
            const existente = await tx.producao.findUnique({
                where: { chave_idempotencia: chaveIdempotencia },
                include: includeProducao,
            });

            if (existente) {
                if (!mesmaRequisicao(existente, idProduto, quantidadeProduzida)) {
                    return {
                        conflito: true,
                    };
                }

                return {
                    producao: existente,
                    duplicada: true,
                };
            }

            const produto = await tx.produto.findUnique({
                where: { id_produto: idProduto },
                include: {
                    tipo_produto: true,
                    receita_producao: {
                        include: {
                            produtos: {
                                include: {
                                    produto: {
                                        include: {
                                            estoque: true,
                                            unidade_medida: true,
                                        },
                                    },
                                    unidade_medida: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!produto || produto.flag_ativo !== 'T') {
                return { erro: 'Produto de produção não encontrado ou inativo.', status: 404 };
            }

            if (
                produto.tipo_produto?.flag_tipo !== 'P' ||
                !produto.receita_producao ||
                produto.receita_producao.flag_ativo !== 'T'
            ) {
                return { erro: 'O produto selecionado não possui uma receita de produção.', status: 400 };
            }

            const receita = produto.receita_producao;
            const rendimentoReceita = converterDecimal(receita.quantidade_produzida);
            const margemPerda = converterDecimal(receita.margem_perda);

            if (
                !rendimentoReceita?.gt(0) ||
                !margemPerda ||
                margemPerda.isNegative() ||
                margemPerda.gt(100) ||
                receita.produtos.length === 0
            ) {
                return {
                    erro: 'A receita precisa ter rendimento maior que zero, margem entre 0 e 100% e ao menos um ingrediente.',
                    status: 400,
                };
            }

            const necessidades = [];
            try {
                for (const item of receita.produtos) {
                    if (item.produto.flag_ativo !== 'T') {
                        return {
                            erro: `O ingrediente "${item.produto.descricao}" está inativo.`,
                            status: 400,
                        };
                    }

                    const necessario = calcular_quantidade_ingrediente(
                        item.quantidade,
                        quantidadeProduzida,
                        rendimentoReceita,
                        margemPerda,
                        item.unidade_medida,
                        item.produto.unidade_medida,
                    );
                    const disponivel = item.produto.estoque
                        ? new Prisma.Decimal(item.produto.estoque.quantidade)
                        : new Prisma.Decimal(0);

                    necessidades.push({
                        id_produto: item.id_produto,
                        produto: item.produto,
                        necessario,
                        disponivel,
                    });
                }
            } catch (error) {
                return { erro: error.message, status: 400 };
            }

            const faltantes = necessidades
                .filter((item) => item.disponivel.lt(item.necessario))
                .map((item) => montarFalta(item, item.disponivel, item.necessario));

            if (faltantes.length > 0) {
                return { faltantes };
            }

            const producao = await tx.producao.create({
                data: {
                    id_produto: produto.id_produto,
                    descricao_receita: receita.descricao,
                    quantidade: quantidadeProduzida,
                    rendimento_receita: rendimentoReceita,
                    margem_perda: margemPerda,
                    chave_idempotencia: chaveIdempotencia,
                },
            });

            for (const item of necessidades.sort((a, b) => a.id_produto - b.id_produto)) {
                if (item.necessario.isZero()) continue;

                const atualizacao = await tx.estoque.updateMany({
                    where: {
                        id_produto: item.id_produto,
                        quantidade: { gte: item.necessario },
                    },
                    data: {
                        quantidade: { decrement: item.necessario },
                    },
                });

                if (atualizacao.count !== 1) {
                    const estoqueAtual = await tx.estoque.findUnique({
                        where: { id_produto: item.id_produto },
                    });
                    const disponivel = estoqueAtual
                        ? new Prisma.Decimal(estoqueAtual.quantidade)
                        : new Prisma.Decimal(0);
                    throw new EstoqueAlteradoError([
                        montarFalta(item, disponivel, item.necessario),
                    ]);
                }

                const estoqueAtualizado = await tx.estoque.findUnique({
                    where: { id_produto: item.id_produto },
                });

                await tx.movimentacao_estoque.create({
                    data: {
                        id_producao: producao.id_producao,
                        id_produto: item.id_produto,
                        tipo: 'SAIDA',
                        quantidade: item.necessario,
                        saldo_final: estoqueAtualizado.quantidade,
                        valor_unitario: 0,
                        valor_total: 0,
                        observacao: `Consumo na produção #${producao.id_producao}`,
                        data_movimento: producao.data_producao,
                    },
                });
            }

            const estoqueFinal = await tx.estoque.upsert({
                where: { id_produto: produto.id_produto },
                create: {
                    id_produto: produto.id_produto,
                    quantidade: quantidadeProduzida,
                    dt_entrada: producao.data_producao,
                },
                update: {
                    quantidade: { increment: quantidadeProduzida },
                },
            });

            await tx.movimentacao_estoque.create({
                data: {
                    id_producao: producao.id_producao,
                    id_produto: produto.id_produto,
                    tipo: 'ENTRADA',
                    quantidade: quantidadeProduzida,
                    saldo_final: estoqueFinal.quantidade,
                    valor_unitario: 0,
                    valor_total: 0,
                    observacao: `Produto final da produção #${producao.id_producao}`,
                    data_movimento: producao.data_producao,
                },
            });

            const producaoCompleta = await tx.producao.findUnique({
                where: { id_producao: producao.id_producao },
                include: includeProducao,
            });

            return { producao: producaoCompleta, duplicada: false };
        });

        if (resultado.conflito) {
            return res.status(409).json({
                MSG: 'A chave de idempotência já foi usada para outra produção.',
            });
        }

        if (resultado.erro) {
            return res.status(resultado.status).json({ MSG: resultado.erro });
        }

        if (resultado.faltantes) {
            return res.status(409).json({
                MSG: 'Estoque insuficiente para realizar a produção.',
                faltantes: resultado.faltantes,
            });
        }

        return res.status(200).json({
            MSG: resultado.duplicada
                ? 'Esta produção já havia sido registrada.'
                : 'Produção realizada com sucesso.',
            duplicada: resultado.duplicada,
            producao: resultado.producao,
        });
    } catch (error) {
        if (error instanceof EstoqueAlteradoError) {
            return res.status(409).json({
                MSG: 'O estoque mudou durante a confirmação. Nenhuma alteração foi mantida.',
                faltantes: error.faltantes,
            });
        }

        if (error?.code === 'P2002') {
            const existente = await prisma.producao.findUnique({
                where: { chave_idempotencia: chaveIdempotencia },
                include: includeProducao,
            });

            if (existente && mesmaRequisicao(existente, idProduto, quantidadeProduzida)) {
                return res.status(200).json({
                    MSG: 'Esta produção já havia sido registrada.',
                    duplicada: true,
                    producao: existente,
                });
            }
        }

        console.error('Erro ao realizar produção:', error);
        return res.status(500).json({ MSG: 'Erro ao realizar produção.' });
    }
}
