import { useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { evolucaoVendas } from '../../data/dashboardData';
import { corGrafico, estiloTooltip } from '../../utils/graficos';

export function EvolucaoVendas() {
    const [visualizacao, setVisualizacao] = useState('mensal');

    const [periodo1, setPeriodo1] = useState('2026-01');
    const [periodo2, setPeriodo2] = useState('2026-02');

    const dadosPeriodo1 = evolucaoVendas[visualizacao][periodo1] ?? [];
    const dadosPeriodo2 = evolucaoVendas[visualizacao][periodo2] ?? [];

    const dados = dadosPeriodo1.map((item) => ({
        periodo: item.periodo,
        periodo1: item.vendas,
        periodo2: dadosPeriodo2.find((dado) => dado.periodo === item.periodo)?.vendas ?? 0,
    }));

    const formatarMoeda = (valor) =>
        Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        });

    return (
        <div className="w-full min-w-0 rounded-xl border border-borda bg-superficie p-5">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-texto">Evolução de vendas</h2>

                <p className="mt-1 text-sm text-texto-suave">
                    Compare o desempenho de vendas entre períodos.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm text-texto-suave">Visualização</label>

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
                        className="w-full rounded-lg border border-borda bg-elevada p-3 text-texto outline-none transition-colors focus:border-primaria focus:ring-1 focus:ring-primaria/30 [&>option]:bg-superficie"
                    >
                        <option value="mensal">Mensal</option>
                        <option value="anual">Anual</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-texto-suave">Primeiro período</label>

                    <select
                        value={periodo1}
                        onChange={(e) => setPeriodo1(e.target.value)}
                        className="w-full rounded-lg border border-borda bg-elevada p-3 text-texto outline-none transition-colors focus:border-primaria focus:ring-1 focus:ring-primaria/30 [&>option]:bg-superficie"
                    >
                        {Object.keys(evolucaoVendas[visualizacao]).map((periodo) => (
                            <option key={periodo} value={periodo}>
                                {visualizacao === 'mensal'
                                    ? new Date(`${periodo}-02T12:00:00`).toLocaleDateString(
                                          'pt-BR',
                                          {
                                              month: 'long',
                                              year: 'numeric',
                                          },
                                      )
                                    : periodo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-texto-suave">Segundo período</label>

                    <select
                        value={periodo2}
                        onChange={(e) => setPeriodo2(e.target.value)}
                        className="w-full rounded-lg border border-borda bg-elevada p-3 text-texto outline-none transition-colors focus:border-primaria focus:ring-1 focus:ring-primaria/30 [&>option]:bg-superficie"
                    >
                        {Object.keys(evolucaoVendas[visualizacao]).map((periodo) => (
                            <option key={periodo} value={periodo}>
                                {visualizacao === 'mensal'
                                    ? new Date(`${periodo}-02T12:00:00`).toLocaleDateString(
                                          'pt-BR',
                                          {
                                              month: 'long',
                                              year: 'numeric',
                                          },
                                      )
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
                        <CartesianGrid strokeDasharray="3 3" stroke={corGrafico.grade} />

                        <XAxis dataKey="periodo" stroke={corGrafico.eixo} tickLine={false} />

                        <YAxis
                            stroke={corGrafico.eixo}
                            tickLine={false}
                            tickFormatter={formatarMoeda}
                        />

                        <Tooltip {...estiloTooltip} formatter={(value) => formatarMoeda(value)} />

                        <Legend
                            wrapperStyle={{
                                color: 'var(--text)',
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="periodo1"
                            name="Primeiro período"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--primary)' }}
                            activeDot={{ r: 7 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="periodo2"
                            name="Segundo período"
                            stroke="var(--warning)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--warning)' }}
                            activeDot={{ r: 7 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
