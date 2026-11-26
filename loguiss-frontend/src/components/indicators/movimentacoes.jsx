import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { movimentacoes } from '../../data/dashboardData';


import { corGrafico, estiloTooltip } from '../../utils/graficos';
import { Button } from '../button';

const periodos = [
    { label: 'Últimos 3 meses', meses: 3 },
    { label: 'Últimos 6 meses', meses: 6 },
    { label: 'Últimos 12 meses', meses: 12 },
];

const dados = movimentacoes

export function Movimentacoes() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState(periodos[2]);

    const [menuAberto, setMenuAberto] = useState(false);

    const mesAtual = new Date().getMonth();

    const dadosFiltrados = Array.from({ length: periodoSelecionado.meses }, (_, indice) => {
        const indiceMes =
            (mesAtual - periodoSelecionado.meses + 1 + indice + dados.length) % dados.length;

        return dados[indiceMes];
    });

    return (
        <div className="mb-5 h-[380px] w-full rounded-xl border border-borda bg-superficie p-5">
            <div className="mb-2 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-texto">Movimentações</h2>

                <p className="mr-4 text-sm text-texto-suave">
                    <span className="text-primaria">Entradas</span>
                    {` e `}
                    <span className="text-perigo-texto">Saídas</span>
                </p>
                <div className="relative">
                    <Button
                        type="button"
                        className="w-auto p-2"
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
                            className="absolute right-0 z-10 mt-2 min-w-full overflow-hidden rounded-lg border border-borda bg-superficie py-1 shadow-lg shadow-black/30"
                            role="menu"
                            aria-label="Selecionar período"
                        >
                            {periodos.map((periodo) => (
                                <li key={periodo.meses} role="none">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={`w-full whitespace-nowrap px-4 py-2 text-left text-sm transition-colors hover:bg-elevada ${
                                            periodoSelecionado.meses === periodo.meses
                                                ? 'text-primaria'
                                                : 'text-texto'
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
                    <CartesianGrid strokeDasharray="3 3" stroke={corGrafico.grade} />

                    <XAxis dataKey="mes" stroke={corGrafico.eixo} tickLine={false} />

                    <YAxis stroke={corGrafico.eixo} tickLine={false} />

                    <Tooltip
                        {...estiloTooltip}
                        cursor={{ fill: 'var(--text)', fillOpacity: 0.05 }}
                    />
                    <Bar
                        dataKey="entradas"
                        name="Entradas"
                        fill={corGrafico.primaria}
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="saidas"
                        name="Saídas"
                        fill={corGrafico.perigo}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
