import { useEffect, useState } from 'react';
import api  from '../services/api'
import { toast } from 'sonner';

import { SideBar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { ButtonEye } from '../components/buttonEye';
import { Inputs } from '../components/Inputs';
import { formatarCPFCNPJ } from '../utils/validacoes';

const movimentacaoInicial = {
    id: null,
    dt_movimentacao: '',
    valor_unitario: '',
    produto: {
        desc: '',
        quantidade: '',
        fornecedor: '',
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
    const [products, setProducts] = useState([]);
    const [produto, setProduto] = useState("");
    const [idProduto, setIdProduto] = useState(null);
    const [mostrarProdutos, setMostrarProdutos] = useState(false);

    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedor, setFornecedor] = useState("");
    const [idFornecedor, setIdFornecedor] = useState(null);
    const [mostrarFornecedores, setMostrarFornecedores] = useState(false);


    const fornecedoresFiltrados = fornecedores.filter((f) =>
    f.nome.toLowerCase().includes(fornecedor.toLowerCase())
    );

    const produtosFiltrados = products.filter((p) =>
    p.descricao.toLowerCase().includes(produto.toLowerCase())
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
        setNewMovimentacao({
            id: movimentacao.id_movimentacao,
            dt_movimentacao: movimentacao.data_movimento?.split("T")[0] || "",
            valor_unitario: movimentacao.valor_unitario || "",
            produto: {
                desc: movimentacao.produto?.descricao || "",
                quantidade: movimentacao.quantidade || "",
                fornecedor: movimentacao.fornecedor?.nome || "",
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

    const salvarMovimentacao =  async (event) => {
        event.preventDefault();

        try {
            const response = await api.post('/movi/create_movi', {
                data_movi: newMovimentacao.dt_movimentacao,
                id_produto: idProduto,
                id_fornecedor: idFornecedor,
                quantidade: newMovimentacao.produto.quantidade,
                tipo: "E",
                valor_unitario: newMovimentacao.produto.valor,
                cnpj: newMovimentacao.fornecedor.cpf,   
                prazo_chegada: newMovimentacao.produto.prazo_chegada


            })

            console.log(response)
        } catch (error) {
            console.log(error)
        }

        toast.success('Movimentação cadastrada com sucesso!');
        fecharFormulario();
        movi_api();
    };

    const buscarProdutos = async () => {
        try {
            const resposta = await api.get("/produto/list_produtos");
            setProducts(resposta.data.produtos);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };
    const movi_api = async () => {
        const movimentacoes = await api.get('/movi/list_movi/E');
        setMovimentacoes(movimentacoes.data.movimentacoes)
    }
    const buscarFornecedores = async () => {
    try {
        const response = await api.get("/fornecedor/list_fornecedor");
        setFornecedores(response.data.fornecedores);
    } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
    }
};

    useEffect(() =>{
        movi_api();
        buscarProdutos();
        buscarFornecedores();
    }, [])

    return (
        <div className="min-h-screen bg-[#050212] text-white">
            <SideBar />
            <main className="ml-72 min-h-screen p-5">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold">
                            Movimentações de entrada
                        </h1>
                        <p className="text-gray-400">
                            Gerencie as movimentações de entrada realizadas no sistema.
                        </p>
                    </div>
                    <Button
                        type="button"
                        className="mt-2 w-auto bg-[#4EDB4E] p-3 hover:bg-[#3CB43C]"
                        onClick={abrirFormularioNovo}
                    >
                        Adicionar movimentação
                    </Button>
                </div>
                <div className="mt-5 overflow-hidden rounded-lg border-2 border-gray-500">
                    <div className="grid grid-cols-[110px_225px_110px_130px_230px_1fr] justify-items-start gap-1 border-b border-gray-500 bg-[#15102b] p-1">
                        <div className="px-4 py-2">
                            Id
                        </div>
                        <div className="px-4 py-2">
                            Produto
                        </div>
                        <div className="px-4 py-2">
                            Qtd.
                        </div>
                        <div className="px-4 py-2">
                            Valor
                        </div>
                        <div className="px-4 py-2">
                            Data da movimentação
                        </div>
                        <div className="px-4 py-2">
                            Fornecedor
                        </div>
                    </div>
                    {/* Movimentações */}
                    <div className="flex flex-col gap-2 bg-[#08031a]">
                        {movimentacoes.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-400">
                                Nenhuma movimentação encontrada.
                            </div>
                        ) : (
                            movimentacoes.map((movimentacao) => (
                                <div
                                    key={movimentacao.id_movimentacao}
                                    className="grid grid-cols-[110px_225px_110px_130px_230px_1fr_80px] justify-items-start gap-1 p-1"
                                >
                                    <div className="px-4 py-4 text-gray-200">
                                        {movimentacao.id_movimentacao}
                                    </div>
                                    <div className="w-full min-w-0 truncate px-4 py-4 text-gray-200">
                                        {movimentacao.produto.descricao}
                                    </div>
                                    <div className="px-4 py-4">
                                        <span className="rounded-lg bg-[#21183d] px-3 py-1 text-gray-200">
                                            {movimentacao.quantidade}
                                        </span>
                                    </div>
                                    <div className="px-4 py-4 text-green-500">
                                        R$ {Number(movimentacao.valor_unitario * movimentacao.quantidade).toFixed(2)}
                                    </div>
                                    <div className="px-4 py-4 text-gray-200">
                                        {new Date(movimentacao.data_movimento).toLocaleDateString('pt-br')}
                                    </div>
                                    <div className="w-full min-w-0 truncate px-4 py-4 text-gray-200">
                                        {movimentacao.fornecedor.nome}
                                    </div>
                                    <div className="w-full min-w-0 px-4 py-4 text-gray-200">
                                        <ButtonEye
                                            isOpen={showMovimentacaoForm && newMovimentacao?.id === movimentacao.id}
                                            onClick={() => abrirFormularioVisualizacao(movimentacao)}
                                            title="Visualizar movimentação"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            {showMovimentacaoForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-lg bg-[#050210] p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {visualizarMovimentacao ? "Visualizar movimentação" : "Adicionar movimentação"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-400">
                                    {visualizarMovimentacao
                                        ? "Visualize os dados da movimentação."
                                        : "Preencha os dados da movimentação."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={fecharFormulario}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={salvarMovimentacao}>
                            <fieldset disabled={visualizarMovimentacao}>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Data da movimentação
                                        </label>
                                        <input
                                            type="date"
                                            disabled={visualizarMovimentacao}
                                            value={newMovimentacao.dt_movimentacao}
                                            onChange={(event) =>
                                                setNewMovimentacao({
                                                    ...newMovimentacao,
                                                    dt_movimentacao: event.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E] disabled:cursor-not-allowed disabled:opacity-70"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="mb-1 block text-sm font-medium text-white">
                                            Fornecedor
                                        </label>

                                        <input
                                            type="text"
                                            disabled={visualizarMovimentacao}
                                            value={fornecedor}
                                            onChange={(event) => {
                                                setFornecedor(event.target.value);
                                                setIdFornecedor(null);
                                                setMostrarFornecedores(true);
                                            }}
                                            onFocus={() => setMostrarFornecedores(true)}
                                            placeholder="Nome do fornecedor"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white placeholder-gray-400 outline-none transition-colors hover:bg-[#15102b] focus:border-purple-500 focus:bg-[#15102b] disabled:cursor-not-allowed disabled:opacity-70"
                                            required
                                        />

                                        {mostrarFornecedores && fornecedor && !visualizarMovimentacao && (
                                            <div className="absolute left-0 top-full z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-700 bg-[#15102b] shadow-xl">
                                                {fornecedoresFiltrados.map((f) => (
                                                    <div
                                                        key={f.id_fornecedor}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                        onClick={() => {
                                                            setFornecedor(f.nome);
                                                            setIdFornecedor(f.id_fornecedor);

                                                            atualizarFornecedor('cpf', formatarCPFCNPJ(f.cnpj));

                                                            setMostrarFornecedores(false);
                                                        }}
                                                        className="cursor-pointer border-b border-gray-700 px-4 py-3 text-white transition-colors last:border-0 hover:bg-[#21183d]"
                                                    >
                                                        {f.nome}
                                                    </div>
                                                ))}

                                                {fornecedoresFiltrados.length === 0 && (
                                                    <div className="p-3 text-sm text-gray-400">
                                                        Nenhum fornecedor encontrado.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <label className="mb-1 block text-sm font-medium text-white">
                                            Produto
                                        </label>

                                        <input
                                            type="text"
                                            value={produto}
                                            disabled={visualizarMovimentacao}
                                            placeholder="Digite o nome do produto..."
                                            onChange={(event) => {
                                                setProduto(event.target.value);
                                                setIdProduto(null);
                                                setMostrarProdutos(true);
                                            }}
                                            onFocus={() => setMostrarProdutos(true)}
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white placeholder-gray-400 outline-none transition-colors hover:bg-[#15102b] focus:border-purple-500 focus:bg-[#15102b] disabled:cursor-not-allowed disabled:opacity-70"
                                            required
                                        />

                                        {mostrarProdutos && produto && !visualizarMovimentacao && (
                                            <div className="absolute left-0 top-full z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-700 bg-[#15102b] shadow-xl">
                                                {produtosFiltrados.map((p) => (
                                                    <div
                                                        key={p.id_produto}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                        onClick={() => {
                                                            setProduto(p.descricao);
                                                            setIdProduto(p.id_produto);
                                                            setMostrarProdutos(false);
                                                        }}
                                                        className="cursor-pointer border-b border-gray-700 px-4 py-3 text-white transition-colors last:border-0 hover:bg-[#21183d]"
                                                    >
                                                        {p.descricao}
                                                    </div>
                                                ))}

                                                {produtosFiltrados.length === 0 && (
                                                    <div className="p-3 text-sm text-gray-400">
                                                        Nenhum produto encontrado.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Prazo de chegada
                                        </label>
                                        <Inputs
                                            type="date"
                                            disabled={visualizarMovimentacao}
                                            value={newMovimentacao.produto.prazo_chegada}
                                            onChange={(event) =>
                                                atualizarProduto('prazo_chegada', event.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E] disabled:cursor-not-allowed disabled:opacity-70"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Quantidade
                                        </label>
                                        <Inputs
                                            type="number"
                                            min="1"
                                            disabled={visualizarMovimentacao}
                                            value={newMovimentacao.produto.quantidade}
                                            onChange={(event) =>
                                                atualizarProduto('quantidade', event.target.value)
                                            }
                                            placeholder="Quantidade"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E] disabled:cursor-not-allowed disabled:opacity-70"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Valor
                                        </label>
                                        <Inputs
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            disabled={visualizarMovimentacao}
                                            value={newMovimentacao.produto.valor}
                                            onChange={(event) =>
                                                atualizarProduto('valor', event.target.value)
                                            }
                                            placeholder="R$ 0,00"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E] disabled:cursor-not-allowed disabled:opacity-70"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            CPF/CNPJ do fornecedor
                                        </label>
                                        <Inputs
                                            type="text"
                                            disabled={visualizarMovimentacao}
                                            value={newMovimentacao.fornecedor.cpf}
                                            onChange={(event) =>
                                                atualizarFornecedor(
                                                    'cpf',
                                                    formatarCPFCNPJ(event.target.value),
                                                )
                                            }
                                            placeholder="CPF ou CNPJ"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E] disabled:cursor-not-allowed disabled:opacity-70"
                                            required
                                        />
                                    </div>
                                </div>
                            </fieldset>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={fecharFormulario}
                                    className="rounded-lg bg-gray-700 px-5 py-3 font-bold hover:bg-gray-600"
                                >
                                    {visualizarMovimentacao ? "Fechar" : "Cancelar"}
                                </button>
                                {!visualizarMovimentacao && (
                                    <Button
                                        type="submit"
                                        className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
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