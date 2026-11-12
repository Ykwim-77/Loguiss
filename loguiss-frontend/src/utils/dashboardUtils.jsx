export function adaptarProdutosDashboard(produtos) {
    return produtos.map((produto) => ({
        id: produto.id_produto,

        nome: produto.descricao,

        categoria:
            produto.categorias?.[0]?.categoria?.descricao ??
            "Sem categoria",

        estoqueAtual: Number(
            produto.estoque?.quantidade ?? 0
        ),

        estoqueMinimo: Number(produto.minimo ?? 0),

        valorUnitario: Number(produto.valor ?? 0),

        // Dados que futuramente virão das movimentações
        saidas: Number(produto.totalSaidas ?? 0),

        diasSemMovimentacao: Number(
            produto.diasSemMovimentacao ?? 0
        ),
    }));
}