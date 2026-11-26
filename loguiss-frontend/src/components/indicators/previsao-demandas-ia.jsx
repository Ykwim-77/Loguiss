import { ChartBarIncreasing } from 'lucide-react';
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
    dados = [],
    series = [],
    eixoX = 'periodo',
    formatarValor = (valor) => valor,
    limiteTop = 5,
}) {
    const listaSeries = Array.isArray(series) ? series : [];
    const listaDados = Array.isArray(dados) ? dados : [];

    // Calcula o volume acumulado de cada série em `dados` para ranquear os mais movimentados/vendidos
    const seriesOrdenadas = [...listaSeries]
        .map((serie) => {
            const somaValores = listaDados.reduce((acc, ponto) => {
                const val = Number(ponto?.[serie.dataKey] ?? 0);
                return acc + (Number.isFinite(val) ? val : 0);
            }, 0);

            return {
                ...serie,
                _volumeTotal: somaValores,
            };
        })
        .sort((a, b) => b._volumeTotal - a._volumeTotal);

    const seriesTop5 = seriesOrdenadas.slice(0, limiteTop);
    const seriesExibidas = seriesTop5.length > 0 ? seriesTop5 : listaSeries.slice(0, limiteTop);

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
                        data={listaDados}
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

                        {seriesExibidas.map((serie, index) => (
                            <Line
                                key={serie.dataKey}
                                type="monotone"
                                dataKey={serie.dataKey}
                                name={serie.nome}
                                stroke={serie.cor || cores[index % cores.length]}
                                strokeWidth={2.5}
                                dot={listaDados.length === 1 ? { r: 5 } : false}
                                activeDot={{ r: 5 }}
                            />
                        ))}

                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
