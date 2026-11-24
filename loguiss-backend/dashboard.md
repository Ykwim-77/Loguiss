Response precisa retornar:

********Observação importante seu bobao, se enviar exatamente os dados que está pedindo (até com os mesmo nomes evita dor de cabeça na integração)*********

object "produto" contendo:
    id
    nome
    categoria
    estoqueAtual
    minimo
    valorunitario
    saidas
    diassemmovimentacao

object "movimentacoes" preicsa retornar
    mes
    "entradas" (contendo total de entrada do mes)
    "saidas" (contendo o total de saidas do mes)

object "evolucaovendas" contendo
    mensal{
        "2026-01":[
            periodo
            vendas//movimentacoes(total)
        ]
    }
    **Importante analisar essa estrutura>>
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
                ],**
    Obs: dentro do mensal
    anual(mesma coisa de cima, porém anualmente, trocando o periodo de número para mes)
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

Dúvidas a serem tiradas

como alterar nomes de tabelas que vem do banco(sem gambiarra)

nome de lista em string? o que é isso? akkakaka

Aprimorar conhecimento a respeito de retorno de duas ou mais tabelas com prisma orm

forma de alterar o mes em número para Nome
    na minha cabeça funcionaria com um for percorrendo uma lista e alterando toda vez de o número for igual ao mes
        com python seria em uma linha, talvez aqui também
