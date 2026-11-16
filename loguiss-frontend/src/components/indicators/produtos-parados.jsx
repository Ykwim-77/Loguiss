
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import { produtos } from '../../data/dashboardData';

export function ProdutosParados() {

    const data = produtos
        .filter((produto) => produto.diasSemMovimentacao > 0)
        .sort((a, b) => b.diasSemMovimentacao - a.diasSemMovimentacao)
        .slice(0, 5);

    return (
        <div className="mb-5 h-[380px] w-full rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-[#F5F5F5]">
                    Produtos parados em estoque
                </h2>
                <p className="mt-1 text-sm text-[#A3A3A3]">
                    Produtos com maior tempo sem movimentação
                </p>
            </div>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 0,
                        left: -10,
                        bottom: 5
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#343434"
                    />
                    <XAxis
                        type="number"
                        stroke="#A3A3A3"
                        allowDecimals={false}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="nome"
                        stroke="#A3A3A3"
                        width={120}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#222222',
                            border: '1px solid #404040',
                            borderRadius: '8px',
                            color: '#F5F5F5'
                        }}
                        formatter={(value) => [
                            `${value} dias`,
                            'Sem movimentação'
                        ]}
                    />
                    <Bar
                        dataKey="diasSemMovimentacao"
                        name="Dias parados"
                        fill="#A3E635"
                        radius={[0, 5, 5, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
