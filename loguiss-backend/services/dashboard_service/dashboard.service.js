import { prisma } from '../../database.js';

export default async function dashboard_service(req, res) {
    try {
        const produtos = await prisma.produto.findMany({
            include: {
                estoque: true
            }
        });

        const movimentacoes = await prisma.movimentacao_estoque.findMany({
            select: {
                id_produto: true,
                tipo: true,
                data_movimento: true,
                quantidade: true,
                valor_unitario: true
            }
        });

        const produtos_formatados = produtos.map((produto) => {
            const movimentacoesProduto = movimentacoes.filter(
                (movimentacao) =>
                    movimentacao.id_produto === produto.id_produto
            );

            const ultimaMovimentacao = movimentacoesProduto
                .sort(
                    (a, b) =>
                        new Date(b.data_movimento) - new Date(a.data_movimento)
                )[0];

            const dias = ultimaMovimentacao
                ? Math.floor(
                    (new Date() - new Date(ultimaMovimentacao.data_movimento)) /
                    (1000 * 60 * 60 * 24)
                )
                : null;

            return {
                id: produto.id_produto,
                nome: produto.descricao,
                estoqueAtual: produto.estoque.quantidade,
                estoqueMinimo: produto.estoque.minimo,
                valorUnitario: produto.valor,

                saidas: movimentacoesProduto
                    .filter((movimentacao) => movimentacao.tipo === "S")
                    .reduce(
                        (total, movimentacao) =>
                            Number(total) + Number(movimentacao.quantidade),
                        0
                    ),

                diasSemMovimentacao: dias
            };
        });

        const nomesMeses = [
            'Jan', 'Fev', 'Mar', 'Abr',
            'Mai', 'Jun', 'Jul', 'Ago',
            'Set', 'Out', 'Nov', 'Dez'
        ];

        const movimentacoes_formatadas = nomesMeses.map((mes, index) => {
            const movimentacoesMes = movimentacoes.filter((movimentacao) => {
                const data = new Date(movimentacao.data_movimento);

                return (
                    data.getMonth() === index &&
                    data.getFullYear() === new Date().getFullYear()
                );
            });

            return {
                mes,
                entradas: movimentacoesMes
                    .filter((movimentacao) => movimentacao.tipo === "E")
                    .reduce((total, movimentacao) => Number(total) + Number(movimentacao.quantidade), 0),

                saidas: movimentacoesMes
                    .filter((movimentacao) => movimentacao.tipo === "S")
                    .reduce((total, movimentacao) => Number(total) + Number(movimentacao.quantidade), 0)
            };
        });    
        
        const evolucaoVendas = {
            mensal: {},
            anual: {}
        };

        const saidas = movimentacoes.filter(
            (m) => m.tipo === "S"
        );

        saidas.forEach((m) => {
            const data = new Date(m.data_movimento);

            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, "0");
            const dia = String(data.getDate()).padStart(2, "0");

            const chaveMes = `${ano}-${mes}`;

            const produto = produtos.find(
                (p) => p.id_produto === m.id_produto
            );

            const valorVenda =
                Number(m.quantidade) * Number(m.valor_unitario ?? produto?.valor ?? 0);

            if (!evolucaoVendas.mensal[chaveMes]) {
                evolucaoVendas.mensal[chaveMes] = [];
            }

            let registroDia = evolucaoVendas.mensal[chaveMes].find(
                (item) => item.periodo === dia
            );

            if (!registroDia) {
                registroDia = {
                    periodo: dia,
                    vendas: 0
                };

                evolucaoVendas.mensal[chaveMes].push(registroDia);
            }

            registroDia.vendas += valorVenda;

            if (!evolucaoVendas.anual[ano]) {
                evolucaoVendas.anual[ano] = Array.from(
                    { length: 12 },
                    (_, index) => ({
                        periodo: nomesMeses[index],
                        vendas: 0
                    })
                );
            }

            evolucaoVendas.anual[ano][data.getMonth()].vendas += valorVenda;
        });

        Object.values(evolucaoVendas.mensal).forEach((dias) => {
            dias.sort((a, b) => Number(a.periodo) - Number(b.periodo));
        });

        return res.status(200).json({
            produtos: produtos_formatados,
            movimentacoes: movimentacoes_formatadas,
            evolucaoVendas: evolucaoVendas
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            MSG: "Erro ao carregar dashboard."
        });
    }
}