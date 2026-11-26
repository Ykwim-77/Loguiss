import { useEffect, useMemo, useState } from 'react';
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

const DADOS_EVOLUCAO_VAZIOS = { mensal: {}, anual: {} };

export function EvolucaoVendas({ dadosEvolucao = DADOS_EVOLUCAO_VAZIOS }) {
    const base = dadosEvolucao || DADOS_EVOLUCAO_VAZIOS;

    const chavesMensal = useMemo(
        () => Object.keys(base.mensal || {}).sort(),
        [base.mensal],
    );
    const chavesAnual = useMemo(
        () => Object.keys(base.anual || {}).sort(),
        [base.anual],
    );

    const [visualizacao, setVisualizacao] = useState('mensal');
    const [periodo1, setPeriodo1] = useState(() => chavesMensal[0] || '2026-10');
    const [periodo2, setPeriodo2] = useState(
        () => chavesMensal[1] || chavesMensal[0] || '2026-10',
    );

    // Garante que periodo1 e periodo2 sempre apontem para chaves válidas ao trocar visualização/dados
    useEffect(() => {
        const chaves = visualizacao === 'mensal' ? chavesMensal : chavesAnual;
        if (!chaves.length) return;

        if (!chaves.includes(periodo1)) {
            setPeriodo1(chaves[0]);
        }
        if (!chaves.includes(periodo2)) {
            setPeriodo2(chaves[1] || chaves[0]);
        }
    }, [visualizacao, chavesMensal, chavesAnual, periodo1, periodo2]);

    const dados = useMemo(() => {
        const mapa = base[visualizacao] || {};
        const lista1 = Array.isArray(mapa[periodo1]) ? mapa[periodo1] : [];
        const lista2 = Array.isArray(mapa[periodo2]) ? mapa[periodo2] : [];

        const map1 = new Map(lista1.map((item) => [String(item.periodo), Number(item.vendas) || 0]));
        const map2 = new Map(lista2.map((item) => [String(item.periodo), Number(item.vendas) || 0]));

        const todosPeriodos = Array.from(new Set([...map1.keys(), ...map2.keys()]));

        // Ordena dias numericamente ("14", "24") ou mantém ordem dos meses ("Jan".."Dez")
        const todosNumericos = todosPeriodos.every((p) => !Number.isNaN(Number(p)));
        todosPeriodos.sort((a, b) => (todosNumericos ? Number(a) - Number(b) : 0));

        return todosPeriodos.map((periodo) => ({
            periodo,
            periodo1: map1.get(periodo) ?? 0,
            periodo2: map2.get(periodo) ?? 0,
        }));
    }, [base, visualizacao, periodo1, periodo2]);

    const formatarMoeda = (valor) =>
        Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        });

    const chavesAtuais = visualizacao === 'mensal' ? chavesMensal : chavesAnual;
    const cor1 = corGrafico?.primaria || '#A3E635';
    const cor2 = corGrafico?.aviso || '#F59E0B';

    return (
        <div className="w-full min-w-0 rounded-xl border border-borda bg-superficie p-5">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-texto">Evolução de vendas</h2>

                <p className="mt-1 text-sm text-texto-suave">
                    Compare o desempenho de vendas entre períodos.
                </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm text-texto-suave">Visualização</label>

                    <select
                        value={visualizacao}
                        onChange={(e) => {
                            const novaVisualizacao = e.target.value;
                            const novasChaves =
                                novaVisualizacao === 'mensal' ? chavesMensal : chavesAnual;

                            setVisualizacao(novaVisualizacao);
                            setPeriodo1(novasChaves[0] || '');
                            setPeriodo2(novasChaves[1] || novasChaves[0] || '');
                        }}
                        className="w-full rounded-lg border border-borda bg-elevada p-3 text-texto outline-none transition-colors focus:border-primaria focus:ring-1 focus:ring-primaria/30 [&>option]:bg-superficie"
                    >
                        <option value="mensal">Mensal</option>
                        <option value="anual">Anual</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-texto-suave">Primeiro período</label>

                    <select
                        value={periodo1}
                        onChange={(e) => setPeriodo1(e.target.value)}
                        className="w-full rounded-lg border border-borda bg-elevada p-3 text-texto outline-none transition-colors focus:border-primaria focus:ring-1 focus:ring-primaria/30 [&>option]:bg-superficie"
                    >
                        {chavesAtuais.map((periodo) => (
                            <option key={periodo} value={periodo}>
                                {visualizacao === 'mensal'
                                    ? new Date(`${periodo}-02T12:00:00`).toLocaleDateString(
                                          'pt-BR',
                                          {
                                              month: 'long',
                                              year: 'numeric',
                                          },
                                      )
                                    : periodo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-texto-suave">Segundo período</label>

                    <select
                        value={periodo2}
                        onChange={(e) => setPeriodo2(e.target.value)}
                        className="w-full rounded-lg border border-borda bg-elevada p-3 text-texto outline-none transition-colors focus:border-primaria focus:ring-1 focus:ring-primaria/30 [&>option]:bg-superficie"
                    >
                        {chavesAtuais.map((periodo) => (
                            <option key={periodo} value={periodo}>
                                {visualizacao === 'mensal'
                                    ? new Date(`${periodo}-02T12:00:00`).toLocaleDateString(
                                          'pt-BR',
                                          {
                                              month: 'long',
                                              year: 'numeric',
                                          },
                                      )
                                    : periodo}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="h-[320px] w-full">
                {dados.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-texto-suave">
                        Sem dados de vendas para os períodos selecionados.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={dados}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={corGrafico.grade} />

                            <XAxis
                                dataKey="periodo"
                                stroke={corGrafico.eixo}
                                tickLine={false}
                            />

                            <YAxis
                                stroke={corGrafico.eixo}
                                tickLine={false}
                                tickFormatter={formatarMoeda}
                            />

                            <Tooltip
                                {...estiloTooltip}
                                formatter={(value) => formatarMoeda(value)}
                            />

                            <Legend
                                wrapperStyle={{
                                    color: corGrafico.eixo || '#F5F5F5',
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="periodo1"
                                name={periodo1 || 'Primeiro período'}
                                stroke={cor1}
                                strokeWidth={3}
                                dot={{ r: 4, fill: cor1 }}
                                activeDot={{ r: 7 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="periodo2"
                                name={periodo2 || 'Segundo período'}
                                stroke={cor2}
                                strokeWidth={3}
                                dot={{ r: 4, fill: cor2 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}