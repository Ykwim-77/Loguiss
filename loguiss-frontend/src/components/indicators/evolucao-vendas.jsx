import { useState } from 'react';

import { evolucaoVendas } from '../../data/dashboardData';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export function EvolucaoVendas() {

    const [visualizacao, setVisualizacao] = useState('mensal');

    const [periodo1, setPeriodo1] = useState('2026-01');
    const [periodo2, setPeriodo2] = useState('2026-02');

    // Busca os dados dos períodos selecionados
    const dadosPeriodo1 = evolucaoVendas[visualizacao][periodo1] ?? [];
    const dadosPeriodo2 = evolucaoVendas[visualizacao][periodo2] ?? [];

    // Combina os dados para alimentar o gráfico
    const dados = dadosPeriodo1.map((item) => ({
        periodo: item.periodo,
        periodo1: item.vendas,
        periodo2: dadosPeriodo2.find(
            (dado) => dado.periodo === item.periodo
        )?.vendas ?? 0,
    }));

    const formatarMoeda = (valor) =>
        Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        });

    return (
        <div className="w-full min-w-0 rounded-xl border border-gray-800 bg-[#0d0920] p-5">

            {/* Cabeçalho */}
            <div className="mb-5">
                <h2 className="text-xl font-bold">
                    Evolução de vendas
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                    Compare o desempenho de vendas entre períodos.
                </p>
            </div>

            {/* Filtros */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div>
                    <label className="mb-2 block text-sm text-gray-400">
                        Visualização
                    </label>

                    <select
                        value={visualizacao}
                        onChange={(e) => {
                            const novaVisualizacao = e.target.value;

                            setVisualizacao(novaVisualizacao);

                            // Atualiza os períodos conforme a visualização
                            if (novaVisualizacao === 'mensal') {
                                setPeriodo1('2026-01');
                                setPeriodo2('2026-02');
                            } else {
                                setPeriodo1('2025');
                                setPeriodo2('2026');
                            }
                        }}
                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                    >
                        <option value="mensal">Mensal</option>
                        <option value="anual">Anual</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-gray-400">
                        Primeiro período
                    </label>

                    <select
                        value={periodo1}
                        onChange={(e) => setPeriodo1(e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                    >
                        {Object.keys(evolucaoVendas[visualizacao]).map((periodo) => (
                            <option key={periodo} value={periodo}>
                                {visualizacao === 'mensal'
                                    ? new Date(`${periodo}-02T12:00:00`).toLocaleDateString('pt-BR', {
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : periodo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-gray-400">
                        Segundo período
                    </label>

                    <select
                        value={periodo2}
                        onChange={(e) => setPeriodo2(e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                    >
                        {Object.keys(evolucaoVendas[visualizacao]).map((periodo) => (
                            <option key={periodo} value={periodo}>
                                {visualizacao === 'mensal'
                                    ? new Date(`${periodo}-02T12:00:00`).toLocaleDateString('pt-BR', {
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : periodo}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {/* Gráfico */}
            <div className="h-[320px] w-full">

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={dados}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#29213f"
                        />

                        <XAxis
                            dataKey="periodo"
                            stroke="#9CA3AF"
                            tickLine={false}
                        />

                        <YAxis
                            stroke="#9CA3AF"
                            tickLine={false}
                            tickFormatter={formatarMoeda}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#15102b',
                                border: '1px solid #2a2638',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                            formatter={(value) => formatarMoeda(value)}
                        />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="periodo1"
                            name="Primeiro período"
                            stroke="#4EDB4E"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 7 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="periodo2"
                            name="Segundo período"
                            stroke="#4389D9"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 7 }}
                        />

                    </LineChart>
                </ResponsiveContainer>

            </div>

        </div>
    );
}