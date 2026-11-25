import { ClipboardList, ArrowUpRight, ArrowDownLeft, Package } from 'lucide-react';
import { useState } from 'react';
import { movimentacoesPadrao } from '../../data/dashboardData';

const formatarNumeroBR = (valor, decimais = 0) =>
    Number(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: decimais,
        maximumFractionDigits: decimais,
    });

export function HistoricoMovimentacoes({
    titulo = 'Histórico de movimentações',
    descricao = 'Saídas e entradas recentes da amostra',
    dados = movimentacoesPadrao,
    badgeRodape = 'Dados demonstrativos',
}) {
    const [filtroTipo, setFiltroTipo] = useState('saida'); 

    const itensFiltrados = dados.filter((item) => item.tipo === filtroTipo);

    return (
        <div className="mt-4 w-full min-w-0 rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">
            {/* Cabeçalho + Toggle Saídas / Entradas */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A3E635]/10">
                        <ClipboardList size={20} className="text-[#A3E635]" />
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
                <div className="inline-flex items-center rounded-xl border border-[#2C2C2C] bg-[#141414] p-1">
                    <button
                        type="button"
                        onClick={() => setFiltroTipo('saida')}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                            filtroTipo === 'saida'
                                ? 'bg-[#262626] text-[#F5F5F5]'
                                : 'text-[#8E8E8E] hover:text-[#D4D4D4]'
                        }`}
                    >
                        <ArrowUpRight size={14} className="text-[#A3E635]" />
                        <span>Saídas</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFiltroTipo('entrada')}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                            filtroTipo === 'entrada'
                                ? 'bg-[#262626] text-[#F5F5F5]'
                                : 'text-[#8E8E8E] hover:text-[#D4D4D4]'
                        }`}
                    >
                        <ArrowDownLeft size={14} className="text-[#A3E635]" />
                        <span>Entradas</span>
                    </button>
                </div>
            </div>
            <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[540px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-[#292929] text-[11px] font-semibold uppercase tracking-wider text-[#8E8E8E]">
                            <th className="pb-3 pr-4">Data</th>
                            <th className="pb-3 px-3">Produto</th>
                            <th className="pb-3 px-3">Tipo</th>
                            <th className="pb-3 px-3">Origem</th>
                            <th className="pb-3 pl-3 text-right">Qtd.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242424]">
                        {itensFiltrados.map((item) => {
                            const isSaida = item.tipo === 'saida';
                            const temDecimal = !Number.isInteger(item.quantidade);

                            return (
                                <tr
                                    key={item.id || `${item.codigo}-${item.documento}`}
                                    className="transition-colors hover:bg-[#222222]/60"
                                >
                                    {/* Data / Hora */}
                                    <td className="py-3.5 pr-4 align-middle whitespace-nowrap">
                                        <div className="text-sm font-semibold text-[#F5F5F5]">
                                            {item.dataLabel}
                                        </div>
                                        <div className="text-xs text-[#8E8E8E]">
                                            {item.hora}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 align-middle">
                                        <div className="text-sm font-semibold text-[#F5F5F5]">
                                            {item.produto}
                                        </div>
                                        <div className="text-xs text-[#8E8E8E]">
                                            {item.codigo}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2E2E2E] bg-[#161616] px-2.5 py-1 text-xs font-medium text-[#E5E5E5]">
                                            {isSaida ? (
                                                <ArrowUpRight size={13} className="text-[#A3E635]" />
                                            ) : (
                                                <ArrowDownLeft size={13} className="text-[#38BDF8]" />
                                            )}
                                            <span>{isSaida ? 'Saída' : 'Entrada'}</span>
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                                        <div className="text-sm font-medium text-[#E5E5E5]">
                                            {item.origem}
                                        </div>
                                        <div className="text-xs text-[#8E8E8E]">
                                            {item.documento}
                                        </div>
                                    </td>
                                    <td className="py-3.5 pl-3 text-right align-middle whitespace-nowrap">
                                        <span
                                            className={`text-sm font-bold ${
                                                isSaida ? 'text-[#F5F5F5]' : 'text-[#A3E635]'
                                            }`}
                                        >
                                            {isSaida ? '-' : '+'}
                                            {formatarNumeroBR(item.quantidade, temDecimal ? 1 : 0)}
                                        </span>{' '}
                                        <span className="text-xs text-[#A3A3A3]">
                                            {item.unidade}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#292929] pt-3 text-xs text-[#8E8E8E]">
                <div className="inline-flex items-center gap-2">
                    <Package size={14} className="text-[#A3E635]" />
                    <span>
                        {itensFiltrados.length}{' '}
                        {filtroTipo === 'saida' ? 'saídas recentes' : 'entradas recentes'}
                    </span>
                </div>

                <span>{badgeRodape}</span>
            </div>
        </div>
    );
}