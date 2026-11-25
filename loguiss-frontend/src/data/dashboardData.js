///Arquivo para armazenar os dados ficticios do dashboard, como entradas e saídas, 
// para serem utilizados nos gráficos e tabelas da página de dashboard.
// Depois podemos apagar ou utilizar para integrar.
import api from '../services/api.js'
import { Gift, Package, Crown, Clock3 } from "lucide-react";

const dados = await api.get('/dashboard/dash')

console.log(dados)

export const produtos = dados.data.produtos

// Dados fictícios das movimentações do sistema
export const movimentacoes = dados.data.movimentacoes
// Dados fictícios da evolução de vendas
export const evolucaoVendas = dados.data.evolucaoVendas
export const dadosDaEmpresa = {
    nome: 'Loguiss Tecnologia LTDA',
    cnpj: '42.318.907/0001-65',
    email: 'financeiro@loguiss.com.br',
    telefone: '(11) 98765-4321',
};

export const planos = [
    {
        id: 'gratuito',
        nome: 'Plano Gratuito',
        icone: Gift,
        selo: 'OFERTA ESPECIAL',
        descricao: 'Uma oportunidade especial para as 100 primeiras empresas cadastradas! Tenha acesso a todos os recursos do Loguiss gratuitamente durante os primeiros 6 meses.',
        rotuloPreco: 'Investimento mensal',
        preco: 'R$ 0,00',
        estilo: {
            card: 'border-primaria/40 bg-gradient-to-br from-primaria/10 to-superficie hover:border-primaria',
            icone: 'bg-primaria/15',
            selo: 'bg-primaria text-sobre-primaria',
        },
    },
    {
        id: 'basico',
        nome: 'Plano Básico',
        icone: Package,
        selo: 'ESSENCIAL',
        descricao: 'Continue utilizando as principais funcionalidades do Loguiss após o período gratuito. Tenha as ferramentas essenciais para organizar seu estoque e gerenciar sua empresa com praticidade.',
        rotuloPreco: 'Investimento mensal',
        preco: 'R$ 45,00',
        estilo: {
            card: 'bg-superficie hover:border-primaria/60',
            icone: 'bg-elevada',
            selo: 'border border-borda bg-elevada text-texto-suave',
        },
    },
    {
        id: 'premium',
        nome: 'Plano Premium',
        icone: Crown,
        selo: 'EM BREVE',
        seloIcone: Clock3,
        descricao: 'Uma experiência ainda mais completa, com funcionalidades avançadas e benefícios exclusivos. Em desenvolvimento, com lançamento previsto após a disponibilização do MVP.',
        rotuloPreco: 'Valor previsto',
        preco: 'R$ 99,90',
        estilo: {
            card: 'border-l-texto-suave bg-fundo hover:border-primaria/40',
            icone: 'bg-elevada',
            selo: 'border border-primaria/20 bg-primaria/10 text-primaria',
        },
    },
];

export const dadosIA = [
    { periodo: 'Janeiro', produtoA: 120, produtoB: 80, produtoC: 150 },
    { periodo: 'Fevereiro', produtoA: 180, produtoB: 100, produtoC: 130 },
    { periodo: 'Março', produtoA: 140, produtoB: 160, produtoC: 190 },
];

export const seriesIA = [
    {
        dataKey: 'produtoA',
        nome: 'Produto A',
        estoqueSeguro: 50,
    },
    {
        dataKey: 'produtoB',
        nome: 'Produto B',
        estoqueSeguro: 80,
    },
    {
        dataKey: 'produtoC',
        nome: 'Produto C',
        estoqueSeguro: 30,
    }
]

export const dadosSaida = [
    { nome: 'produtoA', quantidade: 75 },
    { nome: 'produtoB', quantidade: 55 },
    { nome: 'produtoC', quantidade: 15 },
];

export const recomendacoesCompraPadrao = [
    {
        id: 'LAC-001',
        nome: 'Leite integral 1 L',
        codigo: 'LAC-001',
        categoria: 'Laticínios',
        estoque: 18,
        unidade: 'un.',
        mediaDia: 4.6,
        coberturaDias: 3.9,
        statusPrazo: 'Comprar hoje',
        urgente: true,
        comprarQtd: 60,
    },
    {
        id: 'HORT-014',
        nome: 'Tomate italiano',
        codigo: 'HORT-014',
        categoria: 'Hortifruti',
        estoque: 12,
        unidade: 'kg',
        mediaDia: 3.5,
        coberturaDias: 3.4,
        statusPrazo: 'Comprar hoje',
        urgente: true,
        comprarQtd: 20,
    },
    {
        id: 'SEC-008',
        nome: 'Farinha de trigo 5 kg',
        codigo: 'SEC-008',
        categoria: 'Mercearia',
        estoque: 6,
        unidade: 'pct.',
        mediaDia: 1.1,
        coberturaDias: 5.5,
        statusPrazo: 'Comprar hoje',
        urgente: true,
        comprarQtd: 14,
    },
    {
        id: 'BEB-022',
        nome: 'Café em grãos 1 kg',
        codigo: 'BEB-022',
        categoria: 'Bebidas',
        estoque: 8,
        unidade: 'pct.',
        mediaDia: 1.3,
        coberturaDias: 6.2,
        statusPrazo: 'Comprar hoje',
        urgente: true,
        comprarQtd: 14,
    },
    {
        id: 'EMB-003',
        nome: 'Embalagem kraft P',
        codigo: 'EMB-003',
        categoria: 'Embalagens',
        estoque: 72,
        unidade: 'un.',
        mediaDia: 12,
        coberturaDias: 6,
        statusPrazo: 'Em 1 dia',
        urgente: false,
        comprarQtd: 150,
    },
];

export const movimentacoesPadrao = [
    {
        id: 'mov-1',
        dataLabel: 'Hoje',
        hora: '14:32',
        produto: 'Leite integral 1 L',
        codigo: 'LAC-001',
        tipo: 'saida',
        origem: 'Consumo / produção',
        documento: 'MOV-2841',
        quantidade: 8,
        unidade: 'un.',
    },
    {
        id: 'mov-2',
        dataLabel: 'Hoje',
        hora: '11:08',
        produto: 'Tomate italiano',
        codigo: 'HORT-014',
        tipo: 'saida',
        origem: 'Consumo / produção',
        documento: 'MOV-2838',
        quantidade: 6,
        unidade: 'kg',
    },
    {
        id: 'mov-3',
        dataLabel: 'Ontem',
        hora: '17:46',
        produto: 'Embalagem kraft P',
        codigo: 'EMB-003',
        tipo: 'saida',
        origem: 'Venda PDV',
        documento: 'PDV-1940',
        quantidade: 24,
        unidade: 'un.',
    },
    {
        id: 'mov-4',
        dataLabel: 'Ontem',
        hora: '15:10',
        produto: 'Café em grãos 1 kg',
        codigo: 'BEB-022',
        tipo: 'saida',
        origem: 'Consumo / produção',
        documento: 'MOV-2827',
        quantidade: 2,
        unidade: 'pct.',
    },
    {
        id: 'mov-5',
        dataLabel: '21 nov',
        hora: '12:05',
        produto: 'Farinha de trigo 5 kg',
        codigo: 'SEC-008',
        tipo: 'saida',
        origem: 'Consumo / produção',
        documento: 'MOV-2796',
        quantidade: 3,
        unidade: 'pct.',
    },
];

export const alertasPadrao = [
    {
        id: 'alerta-1',
        titulo: 'Ruptura próxima',
        severidade: 'urgente',
        descricao:
            'O saldo cobre cerca de 3,9 dias diante de um prazo de reposição demonstrativo de 2 dias. Confirme o saldo físico e o prazo do fornecedor.',
        tempo: 'Há 12 min',
        codigo: 'LAC-001',
    },
    {
        id: 'alerta-2',
        titulo: 'Cobertura de estoque reduzida',
        severidade: 'atencao',
        descricao:
            'O saldo de tomate italiano cobre cerca de 3,4 dias. Verifique o prazo de reposição e o estoque mínimo configurado.',
        tempo: 'Há 38 min',
        codigo: 'HORT-014',
    },
    {
        id: 'alerta-3',
        titulo: 'Consumo em alta',
        severidade: 'informativo',
        descricao:
            'A saída de café cresceu 7% em relação à média recente.',
        tempo: 'Hoje, 08:15',
        codigo: 'BEB-022',
    },
];