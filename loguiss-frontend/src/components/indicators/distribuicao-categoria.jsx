import {
    Pie,
    PieChart,
    Sector,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import { useActiveTooltipDataPoints, useIsTooltipActive } from 'recharts';

import { produtos } from '../../data/dashboardData';

const COLORS = ['#4EDB4E', '#4389D9', '#E5A23B', '#A855F7'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}) => {
    if (
        cx == null ||
        cy == null ||
        innerRadius == null ||
        outerRadius == null
    ) {
        return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

    const x = Number(cx) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = Number(cy) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#ffffff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={13}
            fontWeight="bold"
        >
            {`${((percent ?? 0) * 100).toFixed(0)}%`}
        </text>
    );
};

const MyCustomPie = (props) => {
    const pontosAtivos = useActiveTooltipDataPoints();
    const tooltipAtivo = useIsTooltipActive();

    const fatiaAtiva =
        tooltipAtivo && props.payload === pontosAtivos?.[0];

    const fillOpacity =
        tooltipAtivo && !fatiaAtiva ? 0.5 : 1;

    return (
        <Sector
            {...props}
            fill={COLORS[props.index % COLORS.length]}
            stroke="none"
            fillOpacity={fillOpacity}
            style={{ transition: 'fill-opacity 0.3s ease' }}
        />
    );
};

export function DistribuicaoCategoria() {
    const dadosCategoria = Object.values(
        produtos.reduce((acumulador, produto) => {
            const categoria = produto.categoria;

            if (!acumulador[categoria]) {
                acumulador[categoria] = {
                    name: categoria,
                    value: 0,
                };
            }

            acumulador[categoria].value++;

            return acumulador;
        }, {})
    );

    return (
        <div className="mb-5 h-[380px] w-125 rounded-xl border border-gray-800 bg-[#0d0920] p-5">

            <div className="mb-4">
                <h2 className="text-xl font-bold">
                    Distribuição por categoria
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                    Quantidade de produtos em cada categoria
                </p>
            </div>

            <div className="h-[270px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dadosCategoria}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={105}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            shape={MyCustomPie}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#15102b',
                                border: '1px solid #2a2638',
                                borderRadius: '8px',
                                color: '#ffffff',
                            }}
                            formatter={(value, name) => [
                                `${value} produtos`,
                                name,
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}