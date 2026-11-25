import { Package } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { dadosSaida } from '../../data/dashboardData';
import { corGrafico, estiloTooltip } from '../../utils/graficos';

export function PrevisaoSaida({
    titulo = 'Previsão de venda',
    descricao = 'Estimativa de saída nos próximos 14 dias',
    dias = 14,
    dados = dadosSaida,
}) {
    return (
        <div className="mt-4 w-full min-w-0 rounded-xl border border-borda bg-superficie p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primaria/10">
                        <Package size={20} className="text-primaria" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-texto ">{titulo}</h2>

                        <p className="text-xs text-texto-suave">{descricao}</p>
                    </div>
                </div>
            </div>

            {/* Indicador de período */}
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-texto">{dias}</span>

                <span className="text-xs text-texto-suave">dias no horizonte de estimativa</span>
            </div>

            {/* Legenda */}
            <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primaria" />

                <p className="text-xs text-texto-suave">
                    Quantidade estimada individualmente por produto
                </p>
            </div>

            {/* Gráfico */}
            <div className="mt-5 h-[230px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={dados}
                        layout="vertical"
                        margin={{
                            top: 5,
                            right: 10,
                            left: 5,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid
                            horizontal={false}
                            stroke={corGrafico.grade}
                            strokeDasharray="3 5"
                        />

                        <XAxis
                            type="number"
                            stroke={corGrafico.eixo}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            type="category"
                            dataKey="nome"
                            width={105}
                            stroke={corGrafico.eixo}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                        />

                        <Tooltip
                            cursor={{ fill: 'var(--text)', fillOpacity: 0.05 }}
                            contentStyle={{ ...estiloTooltip.contentStyle, fontSize: '12px' }}
                            formatter={(valor) => [`${valor} unidades`, 'Saída estimada']}
                        />

                        <Bar
                            dataKey="quantidade"
                            fill={corGrafico.primaria}
                            radius={[0, 5, 5, 0]}
                            barSize={9}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Rodapé informativo */}
            <div className="mt-4 border-t border-borda pt-3">
                <p className="text-xs leading-relaxed text-texto-suave">
                    Estimativa por SKU baseada na média diária de saídas da amostra. A unidade de
                    medida aparece ao consultar cada barra; não somamos unidades diferentes.
                </p>
            </div>
        </div>
    );
}
