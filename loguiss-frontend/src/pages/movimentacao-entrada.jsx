import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { ButtonEye } from '../components/buttonEye';
import { Inputs } from '../components/inputs';
import { formatarCPFCNPJ } from '../utils/validacoes';
import { formatarMoeda, formatarData } from '../utils/validacoes';

const movimentacaoInicial = {
    id: null,
    dt_movimentacao: '',
    produto: {
        desc: '',
        quantidade: '',
        valor: '',
        prazo_chegada: ''
    },
    fornecedor: {
        desc: '',
        cpf: '',
    },
};

function MovimentacaoEntrada() {
    const [showMovimentacaoForm, setShowMovimentacaoForm] = useState(false);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [visualizarMovimentacao, setVisualizarMovimentacao] = useState(false);
    const [newMovimentacao, setNewMovimentacao] = useState(movimentacaoInicial);
    const [proximoId, setProximoId] = useState(1);

    // Bloqueia o scroll enquanto o modal estiver aberto
    useEffect(() => {
        if (showMovimentacaoForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showMovimentacaoForm]);

    const atualizarFornecedor = (campo, valor) => {
        setNewMovimentacao((prev) => ({
            ...prev,
            fornecedor: { ...prev.fornecedor, [campo]: valor },
        }));
    };

    const atualizarProduto = (campo, valor) => {
        setNewMovimentacao((prev) => ({
            ...prev,
            produto: { ...prev.produto, [campo]: valor },
        }));
    };

    const fecharFormulario = () => {
        setShowMovimentacaoForm(false);
        setVisualizarMovimentacao(false);
        setNewMovimentacao(movimentacaoInicial);
    };

    const abrirFormularioNovo = () => {
        setNewMovimentacao(movimentacaoInicial);
        setVisualizarMovimentacao(false);
        setShowMovimentacaoForm(true);
    };

    const abrirFormularioVisualizacao = (movimentacao) => {
        setNewMovimentacao(movimentacao);
        setVisualizarMovimentacao(true);
        setShowMovimentacaoForm(true);
    };

    const salvarMovimentacao = (event) => {
        event.preventDefault();

        setMovimentacoes((atuais) => [...atuais, { ...newMovimentacao, id: proximoId }]);
        setProximoId((atual) => atual + 1);

        toast.success('Movimentação cadastrada com sucesso!');
        fecharFormulario();
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">

                {/* Cabeçalho */}
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold text-[var(--text)]">
                            Movimentações de entrada
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Gerencie as movimentações de entrada realizadas no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto"
                        onClick={abrirFormularioNovo}
                    >
                        Adicionar movimentação
                    </Button>
                </div>

                {/* Tabela de movimentações */}
                <div className="mt-5 overflow-hidden rounded-xl border border-[#343434]">

                    {/* Cabeçalho da tabela */}
                    <div className="grid grid-cols-[110px_225px_110px_130px_230px_1fr_80px] justify-items-start gap-1 border-b border-[#343434] bg-[#1B1B1B] p-1 text-[#F5F5F5]">
                        <div className="px-4 py-2 font-semibold">Id</div>
                        <div className="px-4 py-2 font-semibold">Produto</div>
                        <div className="px-4 py-2 font-semibold">Qtd.</div>
                        <div className="px-4 py-2 font-semibold">Valor</div>
                        <div className="px-4 py-2 font-semibold">Data da movimentação</div>
                        <div className="px-4 py-2 font-semibold">Fornecedor</div>
                        <div className="px-4 py-2" aria-hidden="true" />
                    </div>

                    {/* Conteúdo da tabela */}
                    <div className="flex flex-col bg-[#151515]">

                        {movimentacoes.length === 0 ? (
                            <div className="px-4 py-8 text-center text-[#A3A3A3]">
                                Nenhuma movimentação encontrada.
                            </div>
                        ) : (
                            movimentacoes.map((movimentacao) => (
                                <div
                                    key={movimentacao.id}
                                    className="grid grid-cols-[110px_225px_110px_130px_230px_1fr_80px] justify-items-start gap-1 border-b border-[#343434] p-1 last:border-b-0 hover:bg-[#1B1B1B] transition-colors"
                                >
                                    <div className="px-4 py-4 text-[#A3A3A3]">
                                        {movimentacao.id}
                                    </div>

                                    <div className="w-full min-w-0 truncate px-4 py-4 text-[#F5F5F5]">
                                        {movimentacao.produto.desc}
                                    </div>

                                    <div className="px-4 py-4">
                                        <span className="rounded-lg border border-[#404040] bg-[#292929] px-3 py-1 text-[#F5F5F5]">
                                            {movimentacao.produto.quantidade}
                                        </span>
                                    </div>

                                    <div className="px-4 py-4 font-medium text-[#A3E635]">
                                        {formatarMoeda(movimentacao.produto.valor)}
                                    </div>

                                    <div className="px-4 py-4 text-[#A3A3A3]">
                                        {formatarData(movimentacao.dt_movimentacao)}
                                    </div>

                                    <div className="w-full min-w-0 truncate px-4 py-4 text-[#F5F5F5]">
                                        {movimentacao.fornecedor.desc}
                                    </div>

                                    <div className="w-full min-w-0 px-4 py-4 text-[#A3A3A3]">
                                        <ButtonEye
                                            isOpen={showMovimentacaoForm && newMovimentacao?.id === movimentacao.id}
                                            onClick={() => abrirFormularioVisualizacao(movimentacao)}
                                            aria-label="Visualizar movimentação"
                                            title="Visualizar movimentação"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Modal de cadastro e visualização */}
            {showMovimentacaoForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-2xl border border-[#343434] bg-[#1B1B1B] p-6 shadow-2xl">

                        {/* Cabeçalho do modal */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#F5F5F5]">
                                    {visualizarMovimentacao
                                        ? "Visualizar movimentação"
                                        : "Adicionar movimentação"}
                                </h2>

                                <p className="mt-1 text-sm text-[#A3A3A3]">
                                    {visualizarMovimentacao
                                        ? "Visualize os dados da movimentação."
                                        : "Preencha os dados da movimentação."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowMovimentacaoForm(false)}
                                className="text-2xl text-[#A3A3A3] transition-colors hover:text-[#A3E635]"
                            >
                                ×
                            </button>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={salvarMovimentacao}>
                            <fieldset disabled={visualizarMovimentacao}>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <Inputs
                                        label="Data da movimentação"
                                        type="date"
                                        value={newMovimentacao.dt_movimentacao}
                                        onChange={(e) =>
                                            setNewMovimentacao({ ...newMovimentacao, dt_movimentacao: e.target.value })
                                        }
                                        required
                                    />

                                    <Inputs
                                        label="Fornecedor"
                                        value={newMovimentacao.fornecedor.desc}
                                        onChange={(e) => atualizarFornecedor('desc', e.target.value)}
                                        placeholder="Nome do fornecedor"
                                        required
                                    />

                                    <Inputs
                                        label="Produto"
                                        value={newMovimentacao.produto.desc}
                                        onChange={(e) => atualizarProduto('desc', e.target.value)}
                                        placeholder="Nome do produto"
                                        required
                                    />

                                    <Inputs
                                        label="Prazo de chegada"
                                        type="date"
                                        min={newMovimentacao.dt_movimentacao}
                                        value={newMovimentacao.produto.prazo_chegada}
                                        onChange={(e) => atualizarProduto('prazo_chegada', e.target.value)}
                                        required
                                    />

                                    <Inputs
                                        label="Quantidade"
                                        type="number"
                                        min="1"
                                        value={newMovimentacao.produto.quantidade}
                                        onChange={(e) => atualizarProduto('quantidade', e.target.value)}
                                        placeholder="Quantidade"
                                        required
                                    />

                                    <Inputs
                                        label="Valor"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newMovimentacao.produto.valor}
                                        onChange={(e) => atualizarProduto('valor', e.target.value)}
                                        placeholder="R$ 0,00"
                                        required
                                    />

                                    <Inputs
                                        label="CPF/CNPJ do fornecedor"
                                        value={newMovimentacao.fornecedor.cpf}
                                        onChange={(e) => atualizarFornecedor('cpf', formatarCPFCNPJ(e.target.value))}
                                        placeholder="CPF ou CNPJ"
                                        required
                                    />

                                </div>
                            </fieldset>

                            {/* Botões do modal */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-[#343434] pt-5">

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="px-5"
                                    onClick={fecharFormulario}
                                >
                                    {visualizarMovimentacao ? "Fechar" : "Cancelar"}
                                </Button>

                                {!visualizarMovimentacao && (
                                    <Button type="submit" className="px-5">
                                        Cadastrar movimentação
                                    </Button>
                                )}

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovimentacaoEntrada;