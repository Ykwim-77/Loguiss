
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

    const dadosPeriodo1 = evolucaoVendas[visualizacao][periodo1] ?? [];
    const dadosPeriodo2 = evolucaoVendas[visualizacao][periodo2] ?? [];

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
        <div className="w-full min-w-0 rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">

            <div className="mb-5">
                <h2 className="text-xl font-bold text-[#F5F5F5]">
                    Evolução de vendas
                </h2>

                <p className="mt-1 text-sm text-[#A3A3A3]">
                    Compare o desempenho de vendas entre períodos.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div>
                    <label className="mb-2 block text-sm text-[#A3A3A3]">
                        Visualização
                    </label>

                    <select
                        value={visualizacao}
                        onChange={(e) => {
                            const novaVisualizacao = e.target.value;

                            setVisualizacao(novaVisualizacao);

                            if (novaVisualizacao === 'mensal') {
                                setPeriodo1('2026-01');
                                setPeriodo2('2026-02');
                            } else {
                                setPeriodo1('2025');
                                setPeriodo2('2026');
                            }
                        }}
                        className="w-full rounded-lg border border-[#404040] bg-[#292929] p-3 text-[#F5F5F5] outline-none transition-colors focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]/30"
                    >
                        <option value="mensal">Mensal</option>
                        <option value="anual">Anual</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-[#A3A3A3]">
                        Primeiro período
                    </label>

                    <select
                        value={periodo1}
                        onChange={(e) => setPeriodo1(e.target.value)}
                        className="w-full rounded-lg border border-[#404040] bg-[#292929] p-3 text-[#F5F5F5] outline-none transition-colors focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]/30"
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
                    <label className="mb-2 block text-sm text-[#A3A3A3]">
                        Segundo período
                    </label>

                    <select
                        value={periodo2}
                        onChange={(e) => setPeriodo2(e.target.value)}
                        className="w-full rounded-lg border border-[#404040] bg-[#292929] p-3 text-[#F5F5F5] outline-none transition-colors focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]/30"
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
                            stroke="#343434"
                        />

                        <XAxis
                            dataKey="periodo"
                            stroke="#A3A3A3"
                            tickLine={false}
                        />

                        <YAxis
                            stroke="#A3A3A3"
                            tickLine={false}
                            tickFormatter={formatarMoeda}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#222222',
                                border: '1px solid #404040',
                                borderRadius: '8px',
                                color: '#F5F5F5',
                            }}
                            formatter={(value) => formatarMoeda(value)}
                        />

                        <Legend
                            wrapperStyle={{
                                color: '#F5F5F5',
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="periodo1"
                            name="Primeiro período"
                            stroke="#A3E635"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#A3E635' }}
                            activeDot={{ r: 7 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="periodo2"
                            name="Segundo período"
                            stroke="#65A30D"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#65A30D' }}
                            activeDot={{ r: 7 }}
                        />

                    </LineChart>
                </ResponsiveContainer>

            </div>

        </div>
    );
}
