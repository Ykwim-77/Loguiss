import { Package, ShoppingCart, AlertTriangle, ArrowRight } from 'lucide-react';
import { recomendacoesCompraPadrao } from '../../data/dashboardData'

const formatarNumeroBR = (valor, decimais = 0) =>
    Number(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: decimais,
        maximumFractionDigits: decimais,
    });

export function RecomendacoesCompra({
    titulo = 'Recomendações de compra',
    descricao = 'Quantidade sugerida e quando iniciar a reposição',
    dados = recomendacoesCompraPadrao,
    onRevisar,
}) {
    const totalAnalisados = dados.length;

    return (
        <div className="mt-4 w-full min-w-0 rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">
            {/* Cabeçalho */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A3E635]/10">
                        <Package size={20} className="text-[#A3E635]" />
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
            <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-[#292929] text-[11px] font-semibold uppercase tracking-wider text-[#8E8E8E]">
                            <th className="pb-3 pr-4">Produto</th>
                            <th className="pb-3 px-3 text-right">Estoque</th>
                            <th className="pb-3 px-3 text-right">Média/Dia</th>
                            <th className="pb-3 px-3 text-right">Cobertura</th>
                            <th className="pb-3 px-3 text-right">Comprar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242424]">
                        {dados.map((item) => {
                            const temDecimalCobertura = !Number.isInteger(item.coberturaDias);
                            return (
                                <tr
                                    key={item.id || item.codigo || item.nome}
                                    className="transition-colors hover:bg-[#222222]/60"
                                >
                                    <td className="py-3.5 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                                    item.urgente
                                                        ? 'bg-[#EF4444]/10 text-[#F87171]'
                                                        : 'bg-[#A3E635]/10 text-[#A3E635]'
                                                }`}
                                            >
                                                <ShoppingCart size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-[#F5F5F5]">
                                                    {item.nome}
                                                </div>
                                                <div className="text-xs text-[#8E8E8E]">
                                                    {item.codigo} · {item.categoria}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 text-right align-middle whitespace-nowrap">
                                        <span className="text-sm font-bold text-[#F5F5F5]">
                                            {formatarNumeroBR(item.estoque)}
                                        </span>{' '}
                                        <span className="text-xs text-[#A3A3A3]">
                                            {item.unidade}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-right align-middle whitespace-nowrap">
                                        <span className="text-sm font-medium text-[#E5E5E5]">
                                            {formatarNumeroBR(item.mediaDia, 1)}
                                        </span>{' '}
                                        <span className="text-xs text-[#8E8E8E]">
                                            {item.unidade}/d
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-right align-middle whitespace-nowrap">
                                        <div className="text-sm font-bold text-[#F5F5F5]">
                                            {formatarNumeroBR(item.coberturaDias, temDecimalCobertura ? 1 : 0)} d
                                        </div>
                                        {item.urgente ? (
                                            <div className="mt-0.5 inline-flex items-center justify-end gap-1 text-xs font-medium text-[#F87171]">
                                                <AlertTriangle size={12} />
                                                <span>{item.statusPrazo || 'Comprar hoje'}</span>
                                            </div>
                                        ) : (
                                            <div className="mt-0.5 text-xs text-[#8E8E8E]">
                                                {item.statusPrazo}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-3 text-right align-middle whitespace-nowrap">
                                        <span className="text-sm font-bold text-[#A3E635]">
                                            +{formatarNumeroBR(item.comprarQtd)}
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
        </div>
    );
}