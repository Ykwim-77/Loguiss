import { ChartBarIncreasing } from 'lucide-react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { dadosIA, seriesIA } from '../../data/dashboardData';
import { corGrafico, estiloTooltip } from '../../utils/graficos';

const cores = [
    'var(--primary)',
    '#65A30D',
    '#38BDF8',
    '#A78BFA',
    '#F97316',
    '#F472B6',
    '#2DD4BF',
    '#FACC15',
    '#818CF8',
    '#FB7185',
];

export function PrevisaoDemandasIA({
    titulo,
    descricao,
    icone: Icon,
    dados = dadosIA,
    series = seriesIA,
    estoqueSeguro = seriesIA.map((serie) => serie.estoqueSeguro),
    eixoX = 'periodo',
    formatarValor = (valor) => valor,
}) {
    return (
        <div className="w-full min-w-0 rounded-xl border border-borda bg-superficie p-5 mt-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primaria/10">
                        <ChartBarIncreasing size={20} className="text-primaria" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-texto">{titulo}</h2>

                        <p className="text-xs text-texto-suave">{descricao}</p>
                    </div>
                </div>
            </div>

            <div className="mt-5 h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={dados}
                        margin={{
                            top: 10,
                            right: 5,
                            left: -15,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={corGrafico.grade} />

                        <XAxis
                            dataKey={eixoX}
                            stroke={corGrafico.eixo}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            minTickGap={15}
                        />

                        <YAxis
                            width={45}
                            stroke={corGrafico.eixo}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            tickFormatter={formatarValor}
                        />

                        <Tooltip
                            {...estiloTooltip}
                            contentStyle={{ ...estiloTooltip.contentStyle, fontSize: '12px' }}
                            formatter={(valor) => formatarValor(valor)}
                        />

                        <Legend
                            verticalAlign="top"
                            align="center"
                            iconType="plainline"
                            iconSize={14}
                            wrapperStyle={{
                                color: 'var(--text)',
                                fontSize: '11px',
                                paddingBottom: '15px',
                            }}
                        />

                        {series.map((serie, index) => (
                            <Line
                                key={serie.dataKey}
                                type="monotone"
                                dataKey={serie.dataKey}
                                name={serie.nome}
                                stroke={serie.cor || cores[index % cores.length]}
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5 }}
                            />
                        ))}

                        {series.map((serie, index) => (
                            <ReferenceLine
                                key={`seguro-${serie.dataKey}`}
                                y={serie.estoqueSeguro}
                                stroke={serie.cor || cores[index % cores.length]}
                                strokeDasharray="6 4"
                                strokeWidth={2}
                                ifOverflow="extendDomain"
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
                <span className="w-6 border-t-2 border-dashed border-texto-suave" />
                <span className="text-xs text-texto-suave">Estoque seguro</span>
            </div>
        </div>
    );
}
