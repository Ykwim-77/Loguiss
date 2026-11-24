
import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'sonner';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { ButtonEye } from '../components/buttonEye';
import { Inputs } from '../components/inputs';
import { formatarCPFCNPJ, formatarMoeda, formatarData } from '../utils/validacoes';

const movimentacaoInicial = {
    id: null,
    dt_movimentacao: '',
    valor_unitario: '',
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

    const [products, setProducts] = useState([]);
    const [produto, setProduto] = useState("");
    const [idProduto, setIdProduto] = useState(null);
    const [mostrarProdutos, setMostrarProdutos] = useState(false);

    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedor, setFornecedor] = useState("");
    const [idFornecedor, setIdFornecedor] = useState(null);
    const [mostrarFornecedores, setMostrarFornecedores] = useState(false);

    // Bloqueia o scroll enquanto o modal estiver aberto
    useEffect(() => {
        document.body.style.overflow = showMovimentacaoForm ? 'hidden' : 'auto';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showMovimentacaoForm]);

    // Filtrar fornecedores
    const fornecedoresFiltrados = fornecedores.filter((f) =>
        (f.nome ?? "").toLowerCase().includes(fornecedor.toLowerCase())
    );

    // Filtrar produtos
    const produtosFiltrados = products.filter((p) =>
        (p.descricao ?? "").toLowerCase().includes(produto.toLowerCase())
    );

    const atualizarFornecedor = (campo, valor) => {
        setNewMovimentacao((prev) => ({
            ...prev,
            fornecedor: {
                ...prev.fornecedor,
                [campo]: valor,
            },
        }));
    };

    const atualizarProduto = (campo, valor) => {
        setNewMovimentacao((prev) => ({
            ...prev,
            produto: {
                ...prev.produto,
                [campo]: valor,
            },
        }));
    };

    // Fechar formulário
    const fecharFormulario = () => {
        setShowMovimentacaoForm(false);
        setVisualizarMovimentacao(false);
        setNewMovimentacao({
            ...movimentacaoInicial,
            produto: { ...movimentacaoInicial.produto },
            fornecedor: { ...movimentacaoInicial.fornecedor },
        });

        setProduto("");
        setFornecedor("");
        setIdProduto(null);
        setIdFornecedor(null);
        setMostrarProdutos(false);
        setMostrarFornecedores(false);
    };

    // Abrir formulário para novo cadastro
    const abrirFormularioNovo = () => {
        fecharFormulario();
        setVisualizarMovimentacao(false);
        setShowMovimentacaoForm(true);
    };

    // Abrir formulário de visualização
    const abrirFormularioVisualizacao = (movimentacao) => {
        setNewMovimentacao({
            id: movimentacao.id_movimentacao,
            dt_movimentacao: movimentacao.data_movimento?.split("T")[0] || "",
            valor_unitario: movimentacao.valor_unitario || "",
            produto: {
                desc: movimentacao.produto?.descricao || "",
                quantidade: movimentacao.quantidade || "",
                valor: movimentacao.valor_unitario || "",
                prazo_chegada: movimentacao.prazo_chegada?.split("T")[0] || "",
            },
            fornecedor: {
                desc: movimentacao.fornecedor?.nome || "",
                cpf: formatarCPFCNPJ(movimentacao.fornecedor?.cnpj || ""),
            },
        });

        setProduto(movimentacao.produto?.descricao || "");
        setFornecedor(movimentacao.fornecedor?.nome || "");

        setIdProduto(movimentacao.id_produto);
        setIdFornecedor(movimentacao.id_fornecedor);

        setVisualizarMovimentacao(true);
        setShowMovimentacaoForm(true);
    };

    // Buscar produtos
    const buscarProdutos = async () => {
        try {
            const resposta = await api.get("/produto/list_produtos");
            setProducts(resposta.data.produtos ?? []);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            toast.error("Erro ao carregar produtos.");
        }
    };

    // Buscar fornecedores
    const buscarFornecedores = async () => {
        try {
            const response = await api.get("/fornecedor/list_fornecedor");
            setFornecedores(response.data.fornecedores ?? []);
        } catch (error) {
            console.error("Erro ao buscar fornecedores:", error);
            toast.error("Erro ao carregar fornecedores.");
        }
    };

    // Buscar movimentações
    const movi_api = async () => {
        try {
            const response = await api.get('/movi/list_movi/E');
            setMovimentacoes(response.data.movimentacoes ?? []);
        } catch (error) {
            console.error("Erro ao buscar movimentações:", error);
            toast.error("Erro ao carregar movimentações.");
        }
    };

    useEffect(() => {
        movi_api();
        buscarProdutos();
        buscarFornecedores();
    }, []);

    // Salvar movimentação
    const salvarMovimentacao = async (event) => {
        event.preventDefault();

        if (!idProduto) {
            toast.error("Selecione um produto da lista.");
            return;
        }

        if (!idFornecedor) {
            toast.error("Selecione um fornecedor da lista.");
            return;
        }

        try {
            await api.post('/movi/create_movi', {
                data_movi: newMovimentacao.dt_movimentacao,
                id_produto: idProduto,
                id_fornecedor: idFornecedor,
                quantidade: Number(newMovimentacao.produto.quantidade),
                tipo: "E",
                valor_unitario: Number(newMovimentacao.produto.valor),
                cnpj: newMovimentacao.fornecedor.cpf,
                prazo_chegada: newMovimentacao.produto.prazo_chegada
            });

            await movi_api();

            toast.success('Movimentação cadastrada com sucesso!');
            fecharFormulario();

        } catch (error) {
            console.error(
                "Erro ao cadastrar movimentação:",
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.MSG ||
                'Erro ao cadastrar movimentação!'
            );
        }
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
                        className="mt-2 w-auto bg-[#A3E635] p-3 text-[#111111] transition-colors hover:bg-[#BEF264]"
                        onClick={abrirFormularioNovo}
                    >
                        Adicionar movimentação
                    </Button>
                </div>

                {/* Tabela de movimentações */}
                <div className="mt-5 overflow-hidden rounded-xl border border-[#343434]">

                    {/* Cabeçalho */}
                    <div className="grid grid-cols-[110px_225px_110px_130px_230px_1fr_80px] justify-items-start gap-1 border-b border-[#343434] bg-[#1B1B1B] p-1 text-[#F5F5F5]">
                        <div className="px-4 py-2 font-semibold">Id</div>
                        <div className="px-4 py-2 font-semibold">Produto</div>
                        <div className="px-4 py-2 font-semibold">Qtd.</div>
                        <div className="px-4 py-2 font-semibold">Valor</div>
                        <div className="px-4 py-2 font-semibold">Data da movimentação</div>
                        <div className="px-4 py-2 font-semibold">Fornecedor</div>
                        <div className="px-4 py-2" aria-hidden="true" />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex flex-col bg-[#151515]">

                        {movimentacoes.length === 0 ? (
                            <div className="px-4 py-8 text-center text-[#A3A3A3]">
                                Nenhuma movimentação encontrada.
                            </div>
                        ) : (
                            movimentacoes.map((movimentacao) => (
                                <div
                                    key={movimentacao.id_movimentacao}
                                    className="grid grid-cols-[110px_225px_110px_130px_230px_1fr_80px] justify-items-start gap-1 border-b border-[#343434] p-1 transition-colors last:border-b-0 hover:bg-[#1B1B1B]"
                                >
                                    <div className="px-4 py-4 text-[#A3A3A3]">
                                        {movimentacao.id_movimentacao}
                                    </div>

                                    <div className="w-full min-w-0 truncate px-4 py-4 text-[#F5F5F5]">
                                        {movimentacao.produto?.descricao}
                                    </div>

                                    <div className="px-4 py-4">
                                        <span className="rounded-lg border border-[#404040] bg-[#292929] px-3 py-1 text-[#F5F5F5]">
                                            {movimentacao.quantidade}
                                        </span>
                                    </div>

                                    <div className="px-4 py-4 font-medium text-[#A3E635]">
                                        {formatarMoeda(
                                            Number(movimentacao.valor_unitario) *
                                            Number(movimentacao.quantidade)
                                        )}
                                    </div>

                                    <div className="px-4 py-4 text-[#A3A3A3]">
                                        {formatarData(movimentacao.data_movimento)}
                                    </div>

                                    <div className="w-full min-w-0 truncate px-4 py-4 text-[#F5F5F5]">
                                        {movimentacao.fornecedor?.nome}
                                    </div>

                                    <div className="w-full min-w-0 px-4 py-4 text-[#A3A3A3]">
                                        <ButtonEye
                                            isOpen={
                                                showMovimentacaoForm &&
                                                newMovimentacao?.id === movimentacao.id_movimentacao
                                            }
                                            onClick={() =>
                                                abrirFormularioVisualizacao(movimentacao)
                                            }
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

            {/* Modal */}
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
                                onClick={fecharFormulario}
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
                                            setNewMovimentacao({
                                                ...newMovimentacao,
                                                dt_movimentacao: e.target.value
                                            })
                                        }
                                        required
                                    />

                                    {/* Fornecedor */}
                                    <div className="relative">
                                        <label className="mb-1 block text-sm font-medium text-[#F5F5F5]">
                                            Fornecedor
                                        </label>

                                        <input
                                            type="text"
                                            value={fornecedor}
                                            onChange={(event) => {
                                                setFornecedor(event.target.value);
                                                setIdFornecedor(null);
                                                setMostrarFornecedores(true);
                                            }}
                                            onFocus={() => setMostrarFornecedores(true)}
                                            placeholder="Nome do fornecedor"
                                            className="w-full rounded-lg border border-[#404040] bg-[#151515] p-3 text-[#F5F5F5] placeholder-[#A3A3A3] outline-none transition-colors focus:border-[#A3E635] disabled:cursor-not-allowed disabled:opacity-70"
                                            required
                                        />

                                        {mostrarFornecedores && fornecedor && !visualizarMovimentacao && (
                                            <div className="absolute left-0 top-full z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-[#404040] bg-[#151515] shadow-xl">
                                                {fornecedoresFiltrados.map((f) => (
                                                    <div
                                                        key={f.id_fornecedor}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                        onClick={() => {
                                                            setFornecedor(f.nome);
                                                            setIdFornecedor(f.id_fornecedor);

                                                            atualizarFornecedor(
                                                                'cpf',
                                                                formatarCPFCNPJ(f.cnpj)
                                                            );

                                                            setMostrarFornecedores(false);
                                                        }}
                                                        className="cursor-pointer border-b border-[#343434] px-4 py-3 text-[#F5F5F5] transition-colors last:border-0 hover:bg-[#292929]"
                                                    >
                                                        {f.nome}
                                                    </div>
                                                ))}

                                                {fornecedoresFiltrados.length === 0 && (
                                                    <div className="p-3 text-sm text-[#A3A3A3]">
                                                        Nenhum fornecedor encontrado.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Produto */}
                                    <div className="relative">
                                        <label className="mb-1 block text-sm font-medium text-[#F5F5F5]">
                                            Produto
                                        </label>

                                        <input
                                            type="text"
                                            value={produto}
                                            placeholder="Digite o nome do produto..."
                                            onChange={(event) => {
                                                setProduto(event.target.value);
                                                setIdProduto(null);
                                                setMostrarProdutos(true);
                                            }}
                                            onFocus={() => setMostrarProdutos(true)}
                                            className="w-full rounded-lg border border-[#404040] bg-[#151515] p-3 text-[#F5F5F5] placeholder-[#A3A3A3] outline-none transition-colors focus:border-[#A3E635] disabled:cursor-not-allowed disabled:opacity-70"
                                            required
                                        />

                                        {mostrarProdutos && produto && !visualizarMovimentacao && (
                                            <div className="absolute left-0 top-full z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-[#404040] bg-[#151515] shadow-xl">
                                                {produtosFiltrados.map((p) => (
                                                    <div
                                                        key={p.id_produto}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                        onClick={() => {
                                                            setProduto(p.descricao);
                                                            setIdProduto(p.id_produto);
                                                            setMostrarProdutos(false);
                                                        }}
                                                        className="cursor-pointer border-b border-[#343434] px-4 py-3 text-[#F5F5F5] transition-colors last:border-0 hover:bg-[#292929]"
                                                    >
                                                        {p.descricao}
                                                    </div>
                                                ))}

                                                {produtosFiltrados.length === 0 && (
                                                    <div className="p-3 text-sm text-[#A3A3A3]">
                                                        Nenhum produto encontrado.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Inputs
                                        label="Prazo de chegada"
                                        type="date"
                                        min={newMovimentacao.dt_movimentacao}
                                        value={newMovimentacao.produto.prazo_chegada}
                                        onChange={(e) =>
                                            atualizarProduto('prazo_chegada', e.target.value)
                                        }
                                        required
                                    />

                                    <Inputs
                                        label="Quantidade"
                                        type="number"
                                        min="1"
                                        value={newMovimentacao.produto.quantidade}
                                        onChange={(e) =>
                                            atualizarProduto('quantidade', e.target.value)
                                        }
                                        placeholder="Quantidade"
                                        required
                                    />

                                    <Inputs
                                        label="Valor unitário"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={newMovimentacao.produto.valor}
                                        onChange={(e) =>
                                            atualizarProduto('valor', e.target.value)
                                        }
                                        placeholder="R$ 0,00"
                                        required
                                    />

                                    <Inputs
                                        label="CPF/CNPJ do fornecedor"
                                        value={newMovimentacao.fornecedor.cpf}
                                        onChange={(e) =>
                                            atualizarFornecedor(
                                                'cpf',
                                                formatarCPFCNPJ(e.target.value)
                                            )
                                        }
                                        placeholder="CPF ou CNPJ"
                                        required
                                    />

                                </div>
                            </fieldset>

                            {/* Botões */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-[#343434] pt-5">

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="border border-[#404040] bg-[#292929] px-5 text-[#F5F5F5] transition-colors hover:bg-[#343434]"
                                    onClick={fecharFormulario}
                                >
                                    {visualizarMovimentacao ? "Fechar" : "Cancelar"}
                                </Button>

                                {!visualizarMovimentacao && (
                                    <Button
                                        type="submit"
                                        className="bg-[#A3E635] px-5 text-[#111111] transition-colors hover:bg-[#BEF264]"
                                    >
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
