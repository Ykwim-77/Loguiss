///Arquivo para armazenar os dados ficticios do dashboard, como entradas e saídas, 
// para serem utilizados nos gráficos e tabelas da página de dashboard.
// Depois podemos apagar ou utilizar para integrar.

export const produtos = [
    {
        id: 1,
        nome: "Parafuso M8",
        categoria: "Matéria-prima",
        estoqueAtual: 8,
        estoqueMinimo: 20,
        valorUnitario: 0.50,
        saidas: 150,
        diasSemMovimentacao: 62,
    },
    {
        id: 2,
        nome: "Chapa de aço",
        categoria: "Matéria-prima",
        estoqueAtual: 35,
        estoqueMinimo: 15,
        valorUnitario: 45.00,
        saidas: 40,
        diasSemMovimentacao: 12,
    },
    {
        id: 3,
        nome: "Embalagem P",
        categoria: "Embalagem",
        estoqueAtual: 15,
        estoqueMinimo: 30,
        valorUnitario: 1.20,
        saidas: 120,
        diasSemMovimentacao: 45,
    },
    {
        id: 4,
        nome: "Produto acabado A",
        categoria: "Produto acabado",
        estoqueAtual: 80,
        estoqueMinimo: 25,
        valorUnitario: 75.00,
        saidas: 220,
        diasSemMovimentacao: 5,
    },
    {
        id: 5,
        nome: "Produto acabado B",
        categoria: "Produto acabado",
        estoqueAtual: 12,
        estoqueMinimo: 20,
        valorUnitario: 95.00,
        saidas: 90,
        diasSemMovimentacao: 90,
    },
];

// Dados fictícios das movimentações do sistema
export const movimentacoes = [
    { mes: 'Jan', entradas: 120, saidas: 80 },
    { mes: 'Fev', entradas: 150, saidas: 100 },
    { mes: 'Mar', entradas: 180, saidas: 130 },
    { mes: 'Abr', entradas: 140, saidas: 90 },
    { mes: 'Mai', entradas: 200, saidas: 150 },
    { mes: 'Jun', entradas: 120, saidas: 80 },
    { mes: 'Jul', entradas: 150, saidas: 100 },
    { mes: 'Ago', entradas: 180, saidas: 130 },
    { mes: 'Set', entradas: 140, saidas: 90 },
    { mes: 'Out', entradas: 200, saidas: 150 },
    { mes: 'Nov', entradas: 120, saidas: 80 },
    { mes: 'Dez', entradas: 150, saidas: 100 },
];

// Dados fictícios da evolução de vendas
export const evolucaoVendas = {
    mensal: {
        "2026-01": [
            { periodo: '01', vendas: 1200 },
            { periodo: '02', vendas: 1500 },
            { periodo: '03', vendas: 1300 },
            { periodo: '04', vendas: 1900 },
            { periodo: '05', vendas: 2200 },
            { periodo: '06', vendas: 1750 },
            { periodo: '07', vendas: 2400 },
        ],

        "2026-02": [
            { periodo: '01', vendas: 900 },
            { periodo: '02', vendas: 1100 },
            { periodo: '03', vendas: 1400 },
            { periodo: '04', vendas: 1250 },
            { periodo: '05', vendas: 1800 },
            { periodo: '06', vendas: 2100 },
            { periodo: '07', vendas: 1900 },
        ],

        "2026-03": [
            { periodo: '01', vendas: 1300 },
            { periodo: '02', vendas: 1600 },
            { periodo: '03', vendas: 1800 },
            { periodo: '04', vendas: 1500 },
            { periodo: '05', vendas: 2100 },
            { periodo: '06', vendas: 2300 },
            { periodo: '07', vendas: 2000 },
        ],
    },

    anual: {
        "2025": [
            { periodo: 'Jan', vendas: 12000 },
            { periodo: 'Fev', vendas: 15000 },
            { periodo: 'Mar', vendas: 13000 },
            { periodo: 'Abr', vendas: 19000 },
            { periodo: 'Mai', vendas: 22000 },
            { periodo: 'Jun', vendas: 17500 },
            { periodo: 'Jul', vendas: 24000 },
            { periodo: 'Ago', vendas: 20000 },
            { periodo: 'Set', vendas: 26000 },
            { periodo: 'Out', vendas: 28000 },
            { periodo: 'Nov', vendas: 25000 },
            { periodo: 'Dez', vendas: 32000 },
        ],

        "2026": [
            { periodo: 'Jan', vendas: 9000 },
            { periodo: 'Fev', vendas: 11000 },
            { periodo: 'Mar', vendas: 14000 },
            { periodo: 'Abr', vendas: 12500 },
            { periodo: 'Mai', vendas: 18000 },
            { periodo: 'Jun', vendas: 21000 },
            { periodo: 'Jul', vendas: 19000 },
            { periodo: 'Ago', vendas: 23000 },
            { periodo: 'Set', vendas: 22000 },
            { periodo: 'Out', vendas: 25000 },
            { periodo: 'Nov', vendas: 27000 },
            { periodo: 'Dez', vendas: 30000 },
        ],
    },
};