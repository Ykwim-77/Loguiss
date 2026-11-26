import { AlertTriangle, ArrowRight, Package, ShoppingCart } from 'lucide-react';

const formatarNumeroBR = (valor, decimais = 0) =>
    Number(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: decimais,
        maximumFractionDigits: decimais,
    });

export function RecomendacoesCompra({
    titulo = 'Recomendações de compra',
    descricao = 'Quantidade sugerida e quando iniciar a reposição',
    dados = [],
    onRevisar,
}) {
    const totalAnalisados = dados.length;

    return (
        <div className="mt-4 w-full min-w-0 rounded-xl border border-borda bg-superficie p-5">
            {/* Cabeçalho */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primaria/10">
                        <Package size={20} className="text-primaria" />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-texto">{titulo}</h2>

                        <p className="text-xs text-texto-suave">{descricao}</p>
                    </div>
                </div>
            </div>
            <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-borda text-[11px] font-semibold uppercase tracking-wider text-texto-suave">
                            <th className="pb-3 pr-4">Produto</th>
                            <th className="pb-3 px-3 text-right">Estoque</th>
                            <th className="pb-3 px-3 text-right">Média/Dia</th>
                            <th className="pb-3 px-3 text-right">Cobertura</th>
                            <th className="pb-3 px-3 text-right">Comprar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-borda">
                        {dados.map((item) => {
                            const temDecimalCobertura = !Number.isInteger(item.coberturaDias);
                            return (
                                <tr
                                    key={item.id || item.codigo || item.nome}
                                    className="transition-colors hover:bg-elevada/60"
                                >
                                    <td className="py-3.5 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                                    item.urgente
                                                        ? 'bg-perigo/10 text-perigo-texto'
                                                        : 'bg-primaria/10 text-primaria'
                                                }`}
                                            >
                                                <ShoppingCart size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-texto">
                                                    {item.nome}
                                                </div>
                                                <div className="text-xs text-texto-suave">
                                                    {item.codigo} · {item.categoria}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-3 text-right align-middle whitespace-nowrap">
                                        <span className="text-sm font-bold text-texto">
                                            {formatarNumeroBR(item.estoque)}
                                        </span>{' '}
                                        <span className="text-xs text-texto-suave">
                                            {item.unidade}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-right align-middle whitespace-nowrap">
                                        <span className="text-sm font-medium text-texto">
                                            {formatarNumeroBR(item.mediaDia, 1)}
                                        </span>{' '}
                                        <span className="text-xs text-texto-suave">
                                            {item.unidade}/d
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-right align-middle whitespace-nowrap">
                                        <div className="text-sm font-bold text-texto">
                                            {formatarNumeroBR(
                                                item.coberturaDias,
                                                temDecimalCobertura ? 1 : 0,
                                            )}{' '}
                                            d
                                        </div>
                                        {item.urgente ? (
                                            <div className="mt-0.5 inline-flex items-center justify-end gap-1 text-xs font-medium text-perigo-texto">
                                                <AlertTriangle size={12} />
                                                <span>{item.statusPrazo || 'Comprar hoje'}</span>
                                            </div>
                                        ) : (
                                            <div className="mt-0.5 text-xs text-texto-suave">
                                                {item.statusPrazo}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-3 text-right align-middle whitespace-nowrap">
                                        <span className="text-sm font-bold text-primaria">
                                            +{formatarNumeroBR(item.comprarQtd)}
                                        </span>{' '}
                                        <span className="text-xs text-texto-suave">
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
