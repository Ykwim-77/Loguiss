///Arquivo para armazenar os dados ficticios do dashboard, como entradas e saídas, 
// para serem utilizados nos gráficos e tabelas da página de dashboard.
// Depois podemos apagar ou utilizar para integrar.
import api from '../services/api.js'

const dados = await api.get('/dashboard/dash')

console.log(dados)

export const produtos = dados.data.produtos

// Dados fictícios das movimentações do sistema
export const movimentacoes = dados.data.movimentacoes
// Dados fictícios da evolução de vendas
export const evolucaoVendas = dados.data.evolucaoVendas