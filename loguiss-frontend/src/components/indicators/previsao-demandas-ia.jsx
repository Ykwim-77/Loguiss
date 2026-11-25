import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { dadosIA, seriesIA } from '../../data/dashboardData';
import { ChartBarIncreasing } from 'lucide-react';

const cores = [
    '#A3E635',
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
        <div className="w-full min-w-0 rounded-xl border border-[#292929] bg-[#1B1B1B] p-5 mt-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A3E635]/10">
                        <ChartBarIncreasing size={20} className="text-[#A3E635]" />
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
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#343434"
                        />

                        <XAxis
                            dataKey={eixoX}
                            stroke="#A3A3A3"
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            minTickGap={15}
                        />

                        <YAxis
                            width={45}
                            stroke="#A3A3A3"
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            tickFormatter={formatarValor}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#222222',
                                border: '1px solid #404040',
                                borderRadius: '8px',
                                color: '#F5F5F5',
                                fontSize: '12px',
                            }}
                            formatter={(valor) => formatarValor(valor)}
                        />

                        <Legend
                            verticalAlign="top"
                            align="center"
                            iconType="plainline"
                            iconSize={14}
                            wrapperStyle={{
                                color: '#F5F5F5',
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
                                dot={false}
                                activeDot={{ r: 5 }}
                            />
                        ))}

                        {seriesExibidas.map((serie, index) => (
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
                <span className="w-6 border-t-2 border-dashed border-[#F97316]" />
                <span className="text-xs text-[#A3A3A3]">
                    Estoque seguro
                </span>
            </div>
        </div>
    );
}