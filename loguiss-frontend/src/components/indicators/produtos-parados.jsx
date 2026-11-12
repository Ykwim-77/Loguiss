import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { produtos } from '../../data/dashboardData';

export function ProdutosParados() {

    const data = produtos
        .filter((produto) => produto.diasSemMovimentacao > 0)
        .sort((a, b) => b.diasSemMovimentacao - a.diasSemMovimentacao)
        .slice(0, 5);

    return (
        <div className="mb-5 h-[380px] w-full rounded-xl border border-gray-800 bg-[#0d0920] p-5">
            <div className="mb-5">
                <h2 className="text-xl font-bold">
                    Produtos parados em estoque
                </h2>
                <p className="mt-1 text-sm text-gray-400">
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
                        stroke="#2a2638"
                    />
                    <XAxis
                        type="number"
                        stroke="#9ca3af"
                        allowDecimals={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="nome"
                        stroke="#9ca3af"
                        width={120}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#15102b',
                            border: '1px solid #2a2638',
                            borderRadius: '8px',
                            color: '#ffffff'
                        }}
                        formatter={(value) => [
                            `${value} dias`,
                            'Sem movimentação'
                        ]}
                    />
                    <Bar
                        dataKey="diasSemMovimentacao"
                        name="Dias parados"
                        fill="#4EDB4E"
                        radius={[0, 5, 5, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
