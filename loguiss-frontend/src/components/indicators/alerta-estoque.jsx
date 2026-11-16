
export function AlertaEstoque({ produtos }) {
    const produtosComEstoqueBaixo = produtos.filter(
        (produto) => produto.estoqueAtual <= produto.estoqueMinimo
    );

    return (
        <div className="mb-5 rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">
            <h2 className="mb-4 text-xl font-bold text-[#F5F5F5]">
                Alertas de estoque baixo
            </h2>
            {produtosComEstoqueBaixo.length === 0 ? (
                <p className="text-sm text-[#A3A3A3]">
                    Nenhum produto com estoque baixo.
                </p>
            ) : (
                <div className="space-y-3">
                    {produtosComEstoqueBaixo.map((produto) => (
                        <div
                            key={produto.id}
                            className="flex items-center justify-between gap-4 rounded-lg border border-[#343434] bg-[#222222] p-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium text-[#F5F5F5]">
                                    {produto.nome}
                                </p>
                                <p className="text-sm text-[#A3A3A3]">
                                    Estoque atual: {produto.estoqueAtual} unidades
                                </p>
                            </div>
                            <span className="shrink-0 rounded-md bg-red-500/10 px-3 py-1 text-sm text-red-400">
                                Estoque baixo
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
