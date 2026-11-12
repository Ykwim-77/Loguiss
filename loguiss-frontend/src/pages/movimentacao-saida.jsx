import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { ButtonEye } from '../components/buttonEye';
import { Inputs } from '../components/inputs';
import { formatarCPFCNPJ } from '../utils/validacoes';
import api from '../services/api';

const movimentacaoInicial = {
    id: null,
    data_movimento: '',
    valor_unitario: '',
    produto: {
        desc: '',
        quantidade: '',
        fornecedor: '',
        valor: '',
    },
    cliente: {
        desc: '',
        cpf: '',
    },
};

function MovimentacaoSaida() {
    const [showMovimentacaoForm, setShowMovimentacaoForm] = useState(false);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [visualizarMovimentacao, setVisualizarMovimentacao] = useState(false);
    const [newMovimentacao, setNewMovimentacao] = useState(movimentacaoInicial);
    const [proximoId, setProximoId] = useState(1);
    const [products, setProducts] = useState([]);
    const [produto, setProduto] = useState("");
    const [idProduto, setIdProduto] = useState(null);
    const [mostrarProdutos, setMostrarProdutos] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [cliente, setCliente] = useState("");
    const [idCliente, setIdCliente] = useState(null);
    const [mostrarClientes, setMostrarClientes] = useState(false);

    const produtosFiltrados = products.filter((p) =>
        p.descricao.toLowerCase().includes(produto.toLowerCase())
    );
    const clientesFiltrados = clientes.filter((c) =>
        (c.nome ?? "").toLowerCase().includes(cliente.toLowerCase())
    );
    const atualizarCliente = (campo, valor) => {
        setNewMovimentacao((prev) => ({
            ...prev,
            cliente: {
                ...prev.cliente,
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
            ...movimentacao,
            data_movimento: movimentacao.data_movimento
                ? movimentacao.data_movimento.slice(0, 10)
                : ""
        });

        setVisualizarMovimentacao(true);
        setShowMovimentacaoForm(true);
    };

    const salvarMovimentacao = (event) => {
        event.preventDefault();

        const movimentacaoComId = {
            ...newMovimentacao,
            id: proximoId,
        };

        setMovimentacoes((atuais) => [...atuais, movimentacaoComId]);
        setProximoId((atual) => atual + 1);

        toast.success('Movimentação cadastrada com sucesso!');
        fecharFormulario();
    };

    const movi_api = async () => {
        const movimentacoes = await api.get('/movi/list_movi/S');
        setMovimentacoes(movimentacoes.data.movimentacoes)
    }
    const buscarProdutos = async () => {
        try {
            const resposta = await api.get("/produto/list_produtos");
            setProducts(resposta.data.produtos);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };
const buscarClientes = async () => {
    try {
        const response = await api.get("/cliente/list_clientes");

        console.log("Retorno dos clientes:", response.data);

        setClientes(
            Array.isArray(response.data)
                ? response.data
                : response.data.clientes || response.data.Clientes || []
        );
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
    }
};



    useEffect(() =>{
        movi_api();
        buscarProdutos();
        buscarClientes();
    }, [])

    return (
        <div className="min-h-screen bg-[#050212] text-white">
            <SideBar />
            <main className="ml-72 min-h-screen p-5">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold">
                            Movimentações de saída
                        </h1>
                        <p className="text-gray-400">
                            Gerencie as movimentações de saída realizadas no sistema.
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
                    <div className="grid grid-cols-[110px_250px_110px_130px_230px_1fr] justify-items-start gap-1 border-b border-gray-500 bg-[#15102b] p-1">
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
                            Cliente
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
                                    className="grid grid-cols-[110px_250px_110px_130px_230px_1fr_80px] justify-items-start gap-1 p-1 border-b border-gray-500"
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
                                        {movimentacao.cliente.nome}
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
                                            value={newMovimentacao.data_movimento || ""}
                                            onChange={(event) =>
                                                setNewMovimentacao({
                                                    ...newMovimentacao,
                                                    data_movimento: event.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="mb-1 block text-sm font-medium text-white">
                                            Cliente
                                        </label>

                                        <input
                                            type="text"
                                            value={cliente}
                                            onChange={(event) => {
                                                setCliente(event.target.value);
                                                setIdCliente(null);
                                                setMostrarClientes(true);
                                                atualizarCliente("cpf", "");
                                            }}
                                            onClick={() => {
                                                if (cliente && idCliente === null) {
                                                    setMostrarClientes(true);
                                                }
                                            }}
                                            placeholder="Nome do cliente"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none hover:bg-[#15102b] focus:border-[#4EDB4E]"
                                            required
                                        />

                                        {mostrarClientes && cliente && idCliente == null && (
                                            <div className="absolute left-0 top-full z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-700 bg-[#15102b] shadow-xl">
                                                {clientesFiltrados.map((c) => (
                                                <div
                                                    key={c.id_cliente}
                                                    onClick={() => {
                                                        setCliente(c.nome);
                                                        setIdCliente(c.id_cliente);

                                                        atualizarCliente("cpf", formatarCPFCNPJ(c.cpf));

                                                        setMostrarClientes(false);
                                                    }}
                                                    className="cursor-pointer border-b border-gray-700 px-4 py-3 text-white hover:bg-[#21183d]"
                                                >
                                                    {c.nome}
                                                </div>
                                                ))}

                                                {clientesFiltrados.length === 0 && (
                                                    <div className="p-3 text-sm text-gray-400">
                                                        Nenhum cliente encontrado.
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
                                            value={produto.descricao}
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

                                                            setNewMovimentacao((prev) => ({
                                                                ...prev,
                                                                produto: {
                                                                    ...prev.produto,
                                                                    desc: p.descricao,
                                                                    valor: p.valor,
                                                                },
                                                                valor_unitario: p.valor,
                                                            }));

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
                                            Quantidade
                                        </label>
                                        <Inputs
                                            type="number"
                                            min="1"
                                            value={newMovimentacao.quantidade}
                                            onChange={(event) =>
                                                atualizarProduto('quantidade', event.target.value)
                                            }
                                            placeholder="Quantidade"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E]"
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
                                                value={newMovimentacao.valor_unitario || ""}
                                                disabled={visualizarMovimentacao}
                                                onChange={(event) =>
                                                    setNewMovimentacao((prev) => ({
                                                        ...prev,
                                                        valor_unitario: event.target.value,
                                                    }))
                                                }
                                                placeholder="R$ 0,00"
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E]"
                                                required
                                            />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            CPF/CNPJ do cliente
                                        </label>
                                        <Inputs
                                            type="text"
                                            value={newMovimentacao.cliente.cpf || ""}
                                            onChange={(event) =>
                                                atualizarCliente(
                                                    'cpf',
                                                    formatarCPFCNPJ(event.target.value),
                                                )
                                            }
                                            placeholder="CPF ou CNPJ"
                                            className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 focus:border-[#4EDB4E]"
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

export default MovimentacaoSaida;