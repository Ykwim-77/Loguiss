import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
import { dadosSaida } from '../../data/dashboardData'

import { Package } from 'lucide-react';

export function PrevisaoSaida({
    titulo = 'Previsão de venda',
    descricao = 'Estimativa de saída nos próximos 14 dias',
    dias = 14,
    dados = dadosSaida,
}) {

    return (
        <div className="mt-4 w-full min-w-0 rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A3E635]/10">
                        <Package size={20} className="text-[#A3E635]" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-[#F5F5F5]">
                            {titulo}
                        </h2>

                        <p className="text-xs text-[#A3A3A3]">
                            {descricao}
                        </p>
                    </div>
                </div>
            </div>

            {/* Indicador de período */}
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#F5F5F5]">
                    {dias}
                </span>

                <span className="text-xs text-[#A3A3A3]">
                    dias no horizonte de estimativa
                </span>
            </div>

            {/* Legenda */}
            <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#A3E635]" />

                <p className="text-xs text-[#A3A3A3]">
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
                            stroke="#343434"
                            strokeDasharray="3 5"
                        />

                        <XAxis
                            type="number"
                            stroke="#737373"
                            tick={{ fill: '#A3A3A3', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            type="category"
                            dataKey="nome"
                            width={105}
                            stroke="#737373"
                            tick={{
                                fill: '#A3A3A3',
                                fontSize: 10,
                            }}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                        />

                        <Tooltip
                            cursor={{ fill: '#FFFFFF08' }}
                            contentStyle={{
                                backgroundColor: '#222222',
                                border: '1px solid #404040',
                                borderRadius: '8px',
                                color: '#F5F5F5',
                                fontSize: '12px',
                            }}
                            formatter={(valor) => [
                                `${valor} unidades`,
                                'Saída estimada',
                            ]}
                        />

                        <Bar
                            dataKey="quantidade"
                            fill="#A3E635"
                            radius={[0, 5, 5, 0]}
                            barSize={9}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Rodapé informativo */}
            <div className="mt-4 border-t border-[#292929] pt-3">
                <p className="text-xs leading-relaxed text-[#A3A3A3]">
                    Estimativa por SKU baseada na média diária de saídas da amostra.
                    A unidade de medida aparece ao consultar cada barra;
                    não somamos unidades diferentes.
                </p>
            </div>

        </div>
    );
}
