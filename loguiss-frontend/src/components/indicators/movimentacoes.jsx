import { useState } from 'react';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import { ChevronDown } from 'lucide-react';
import { Button } from '../button';

import { movimentacoes } from '../../data/dashboardData';

const periodos = [
    { label: 'Últimos 3 meses', meses: 3 },
    { label: 'Últimos 6 meses', meses: 6 },
    { label: 'Últimos 12 meses', meses: 12 },
];

export function Movimentacoes() {

    const [periodoSelecionado, setPeriodoSelecionado] =
        useState(periodos[2]);

    const [menuAberto, setMenuAberto] = useState(false);

    const mesAtual = new Date().getMonth();

    const dadosFiltrados = Array.from(
        { length: periodoSelecionado.meses },
        (_, indice) => {
            const indiceMes = (
                mesAtual -
                periodoSelecionado.meses +
                1 +
                indice +
                movimentacoes.length
            ) % movimentacoes.length;

            return movimentacoes[indiceMes];
        }
    );

    return (
        <div className="mb-5 h-[380px] w-full rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">

            <div className="mb-2 flex items-center justify-between gap-4">

                <h2 className="text-xl font-bold text-[#F5F5F5]">
                    Movimentações
                </h2>

                <p className="mr-4 text-sm text-[#A3A3A3]">
                    <span className="text-[#A3E635]">Entradas</span>
                    {` e `}
                    <span className="text-red-400">Saídas</span>
                </p>

                <div className="relative">

                    <Button
                        type="button"
                        className="w-auto bg-[#A3E635] p-2 text-[#111111] transition-colors hover:bg-[#BEF264]"
                        aria-haspopup="menu"
                        aria-expanded={menuAberto}
                        onClick={() => setMenuAberto((aberto) => !aberto)}
                        onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                                setMenuAberto(false);
                            }
                        }}
                    >
                        <span className="flex items-center justify-center">
                            {periodoSelecionado.label}
                            <ChevronDown className="ml-2" size={20} />
                        </span>
                    </Button>

                    {menuAberto && (
                        <ul
                            className="absolute right-0 z-10 mt-2 min-w-full overflow-hidden rounded-lg border border-[#404040] bg-[#222222] py-1 shadow-lg shadow-black/30"
                            role="menu"
                            aria-label="Selecionar período"
                        >
                            {periodos.map((periodo) => (
                                <li key={periodo.meses} role="none">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={`w-full whitespace-nowrap px-4 py-2 text-left text-sm transition-colors hover:bg-[#343434] ${
                                            periodoSelecionado.meses === periodo.meses
                                                ? 'text-[#A3E635]'
                                                : 'text-[#F5F5F5]'
                                        }`}
                                        onClick={() => {
                                            setPeriodoSelecionado(periodo);
                                            setMenuAberto(false);
                                        }}
                                    >
                                        {periodo.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                </div>

            </div>

            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={dadosFiltrados}>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#343434"
                    />

                    <XAxis
                        dataKey="mes"
                        stroke="#A3A3A3"
                        tickLine={false}
                    />

                    <YAxis
                        stroke="#A3A3A3"
                        tickLine={false}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#222222',
                            border: '1px solid #404040',
                            borderRadius: '8px',
                            color: '#F5F5F5'
                        }}
                        labelStyle={{
                            color: '#F5F5F5',
                            fontWeight: 'bold'
                        }}
                        cursor={{
                            fill: '#ffffff',
                            fillOpacity: 0.05
                        }}
                    />

                    <Bar
                        dataKey="entradas"
                        name="Entradas"
                        fill="#A3E635"
                        radius={[4, 4, 0, 0]}
                    />

                    <Bar
                        dataKey="saidas"
                        name="Saídas"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                    />

                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}
