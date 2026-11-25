export function AlertaEstoque({ produtos }) {
    const produtosComEstoqueBaixo = produtos.filter(
        (produto) => produto.estoqueAtual <= produto.estoqueMinimo,
    );

    return (
        <div className="mb-5 rounded-xl border border-borda bg-superficie p-5">
            <h2 className="mb-4 text-xl font-bold text-texto">Alertas de estoque baixo</h2>
            {produtosComEstoqueBaixo.length === 0 ? (
                <p className="text-sm text-texto-suave">Nenhum produto com estoque baixo.</p>
            ) : (
                <div className="space-y-3">
                    {produtosComEstoqueBaixo.map((produto) => (
                        <div
                            key={produto.id}
                            className="flex items-center justify-between gap-4 rounded-lg border border-borda bg-elevada p-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium text-texto">{produto.nome}</p>
                                <p className="text-sm text-texto-suave">
                                    Estoque atual: {produto.estoqueAtual} unidades
                                </p>
                            </div>
                            <span className="shrink-0 rounded-md bg-perigo/10 px-3 py-1 text-sm text-perigo-texto">
                                Estoque baixo
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
