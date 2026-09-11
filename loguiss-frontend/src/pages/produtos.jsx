import { useState } from 'react';
import { toast } from 'sonner';

import { LayoutDashboard, Folder, Shuffle, Brain, Cog, Search, Package } from 'lucide-react';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button'
import { Inputs } from '../components/inputs';
import { Card } from '../components/card';

function Produtos() {

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/home",
            active: true,
        },
        {
            label: "Cadastros",
            icon: Folder,
            subMenu: [
                {
                    label: "Produtos",
                    subMenu: [
                        { label: "Produtos", href: "/produtos" },
                        { label: "Unidade de Medida", href: "/unidades-medida" },
                        { label: "Categorias", href: "/categorias" },
                    ],
                },
                { label: "Usuários", href: "/usuarios" },
                { label: "Clientes", href: "/clientes" },
                { label: "Fornecedores", href: "/fornecedores" },
            ],
        },
        {
            label: "Movimentações",
            icon: Shuffle,
            subMenu: [
                {
                    label: "Movimentações de saída",
                    href: "/movimentacoes-saida",
                },
                {
                    label: "Movimentações de entrada",
                    href: "/movimentacoes-entrada",
                },
            ],
        },
        {
            label: "Previsão IA",
            icon: Brain,
            subMenu: [
                {
                    label: "Previsão de demanda",
                    href: "/previsao-demanda",
                },
                {
                    label: "Configurações da IA",
                    href: "/configuracoes-ia",
                },
            ],
        },
        {
            label: "Configurações",
            icon: Cog,
            href: "/configuracoes",
        },
    ];

    const [showProductForm, setShowProductForm] = useState(false);

    const [newProduct, setNewProduct] = useState({
        desc: "",
        categoria: "",
        minimo: "",
        unidade: "",
        valor: "",
        quantidade_estoque: "15", //como o usuário não pode digitar nesse campo, o valor informado vai ser o referente a tabela estoque, que é movimentada por saídas e entradas.
        fornecedor: "",
        dt_entrada: "",
        prazo_saida: "",
        fgTipoProducao: false,
        receita: null
    });

    const [newReceita, setNewReceita] = useState({
        nome: "",
        margemPerda: "",
        quantidadePerdida: "",
        quantidadeProduzida: "",
        ingredientes: [
            {
                produto: "",
                quantidade: "",
                unidade: ""
            }
        ],
    });

    //CRUD de produtos
    const addNewProduct = () => {

        setProducts((produtosAtuais) => [
            ...produtosAtuais,
            newProduct
        ]);

        setShowProductForm(false);

        setNewProduct({
            desc: "",
            categoria: "",
            minimo: "",
            unidade: "",
            valor: "",
            quantidade_estoque: "15",
            fornecedor: "",
            dt_entrada: "",
            prazo_saida: "",
            fgTipoProducao: false,
            receita: null
        });
    };

    const editProduct = (index, updatedProduct) => {
        setProducts((produtosAtuais) => {
            const produtosAtualizados = [...produtosAtuais];
            produtosAtualizados[index] = updatedProduct;
            return produtosAtualizados;
        });
    };

    const deleteProduct = (index) => {
        setProducts((produtosAtuais) => {
            const produtosAtualizados = [...produtosAtuais];
            produtosAtualizados.splice(index, 1);
            return produtosAtualizados;
        });
    };

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const filteredProducts = products
        .map((produto, index) => ({ produto, index }))
        .filter(({ produto }) =>
            produto.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (

        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar menuItems={menuItems} />

            <main className="ml-72 min-h-screen p-5">

                <div className="flex items-center justify-between mb-3">

                    <div> {/* Agrupa o título e a descrição para separá-los do botão no layout flex */}

                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Produtos
                        </h1>

                        <p className="text-gray-400">
                            Esta é a página de produtos. Aqui você pode gerenciar os produtos cadastrados no sistema.
                        </p>

                    </div>

                    {/*Adicionar novo produto*/}
                    <Button
                        type="button"
                        className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto mt-2"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewProduct({
                                desc: "",
                                categoria: "",
                                minimo: "",
                                unidade: "",
                                valor: "",
                                quantidade_estoque: "15",
                                fornecedor: "",
                                dt_entrada: "",
                                prazo_saida: "",
                                fgTipoProducao: false,
                                receita: null
                            });
                            setShowProductForm(true);
                        }}
                    >
                        Adicionar novo produto
                    </Button>

                </div>

                <div className="flex items-center justify-between">

                <Inputs
                    type="text"
                    placeholder="Pesquisar produtos..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    className="mt-5 w-1/2 rounded-lg border bg-[#15102b] p-3 focus:border-[#4EDB4E]"
                    icon={Search}
                />

                </div>

                {/*Card de produtos*/}
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                    {filteredProducts.map(({ produto, index }) => (
                        
                        <Card
                            key={index}
                            desc={produto.desc}
                            icon={<Package className="h-6 w-6 mt-2 text-gray-400" />}
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewProduct(produto);
                                setShowProductForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir este produto?")) {
                                    deleteProduct(index);
                                    toast.success("Produto excluído com sucesso!");
                                }
                            }}
                        >

                            <p className="mt-2 text-gray-400">
                                Categoria: {produto.categoria}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Quantidade: {produto.quantidade_estoque}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Valor: R$ {produto.valor}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Fornecedor: {produto.fornecedor}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Produto Produção:{" "}
                                {produto.fgTipoProducao ? "Sim" : "Não"}
                            </p>

                        </Card>
                    ))}

                </div>

            </main>

            {/*Formulário de produtos*/}
            {showProductForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">

                    <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-[#050210] p-6 shadow-2xl">

                        <div className="mb-6 flex shrink-0 items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {editingIndex !== null ? "Editar produto" : "Adicionar produto"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    {editingIndex !== null
                                        ? "Atualize os dados do produto."
                                        : "Preencha os dados do novo produto."}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setShowProductForm(false)}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>

                        </div>

                            <form
                                className="flex min-h-0 flex-1 flex-col"
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    const produtoParaSalvar = {
                                        ...newProduct,
                                        receita: newProduct.fgTipoProducao ? newReceita : null,
                                    };

                                    if (editingIndex !== null) {
                                        editProduct(editingIndex, produtoParaSalvar);
                                        toast.success("Produto atualizado com sucesso!");
                                    } else {
                                        setProducts((produtosAtuais) => [
                                            ...produtosAtuais,
                                            produtoParaSalvar,
                                        ]);
                                        toast.success("Produto cadastrado com sucesso!");
                                    }

                                    setEditingIndex(null);
                                    setShowProductForm(false);
                                }}
                            >
                            
                                <div className="min-h-0 flex-1 overflow-y-auto pr-2">

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        <div className="sm:col-span-2">

                                            <label className="mb-1 block text-sm font-medium">
                                                Descrição
                                            </label>

                                            <input
                                                type="text"
                                                value={newProduct.desc}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        desc: e.target.value
                                                    })
                                                }
                                                placeholder="Nome do produto"
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                                required
                                            />

                                        </div>

                                        <div>

                                            <label className="mb-1 block text-sm font-medium">
                                                Categoria
                                            </label>

                                            <input
                                                type="text"
                                                value={newProduct.categoria}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        categoria: e.target.value
                                                    })
                                                }
                                                placeholder="Ex: Eletrônico"
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                                required
                                            />

                                        </div>

                                        <div>

                                            <label className="mb-1 block text-sm font-medium">
                                                Unidade
                                            </label>

                                            <input
                                                type="text"
                                                value={newProduct.unidade}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        unidade: e.target.value
                                                    })
                                                }
                                                placeholder="Ex: UN"
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                                required
                                            />

                                        </div>

                                        <div>

                                            <label className="mb-1 block text-sm font-medium">
                                                Estoque mínimo
                                            </label>

                                            <input
                                                type="number"
                                                value={newProduct.minimo}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        minimo: e.target.value
                                                    })
                                                }
                                                placeholder="0"
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                                required
                                            />

                                        </div>

                                        <div>

                                            <label className="mb-1 block text-sm font-medium">
                                                Quantidade
                                            </label>

                                            <input
                                                type="number"
                                                value={newProduct.quantidade_estoque}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        quantidade_estoque: e.target.value
                                                    })
                                                }
                                                placeholder="0"
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E] cursor-not-allowed"
                                                disabled
                                            />

                                        </div>

                                        <div>

                                            <label className="mb-1 block text-sm font-medium">
                                                Valor
                                            </label>

                                            <input
                                                type="number"
                                                step="0.01"
                                                value={newProduct.valor}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        valor: e.target.value
                                                    })
                                                }
                                                placeholder="0,00"
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                                required
                                            />

                                        </div>

                                        <div>

                                            <label className="mb-1 block text-sm font-medium">
                                                Fornecedor
                                            </label>

                                            <input
                                                type="text"
                                                value={newProduct.fornecedor}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        fornecedor: e.target.value
                                                    })
                                                }
                                                placeholder="Nome do fornecedor"
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                                required
                                            />

                                        </div>

                                        <div>

                                            <label className="mb-1 block text-sm font-medium">
                                                Data de entrada
                                            </label>

                                            <input
                                                type="date"
                                                value={newProduct.dt_entrada}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        dt_entrada: e.target.value
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                                required
                                            />

                                        </div>

                                        <div>

                                            <label className="mb-1 block text-sm font-medium">
                                                Prazo de saída
                                            </label>

                                            <input
                                                type="date"
                                                value={newProduct.prazo_saida}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        prazo_saida: e.target.value
                                                    })
                                                }
                                                className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                            />

                                        </div>

                                        <div>

                                            <label className="flex cursor-pointer items-center gap-3 rounded-lg  p-3">

                                                <input
                                                    type="checkbox"
                                                    checked={newProduct.fgTipoProducao}
                                                    onChange={(e) =>
                                                        setNewProduct({
                                                            ...newProduct,
                                                            fgTipoProducao: e.target.checked,
                                                        })
                                                    }
                                                    className="h-5 w-5 accent-[#4EDB4E]"
                                                />

                                                <span>
                                                    {newProduct.fgTipoProducao
                                                        ? "Produto Produção"
                                                        : "Produto Normal"}
                                                </span>

                                            </label>
                                            
                                        </div>

                                        <div className="sm:col-span-2">

                                            {newProduct.fgTipoProducao && (
                                                <div className="sm:col-span-2 rounded-lg border border-gray-700 p-4">
                                                    <h3 className="mb-4 text-lg font-bold">
                                                        Receita
                                                    </h3>

                                                    {/* Nome da receita */}
                                                    <input
                                                        type="text"
                                                        placeholder="Nome da receita"
                                                        value={newReceita.nome}
                                                        onChange={(e) =>
                                                            setNewReceita({
                                                                ...newReceita,
                                                                nome: e.target.value,
                                                            })
                                                        }
                                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                        required
                                                    />

                                                    {/* Margem de perda */}
                                                    <input
                                                        type="number"
                                                        placeholder="Margem de perda (%)"
                                                        value={newReceita.margemPerda}
                                                        onChange={(e) =>
                                                            setNewReceita({
                                                                ...newReceita,
                                                                margemPerda: e.target.value,
                                                            })
                                                        }
                                                        className="mt-3 w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                    />

                                                    {/* Quantidade produzida */}
                                                    <input
                                                        type="number"
                                                        placeholder="Quantidade produzida"
                                                        value={newReceita.quantidadeProduzida}
                                                        onChange={(e) =>
                                                            setNewReceita({
                                                                ...newReceita,
                                                                quantidadeProduzida: e.target.value,
                                                            })
                                                        }
                                                        className="mt-3 w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                        required
                                                    />

                                                    {/* Quantidade perdida, validar se vai precisar mesmo desse campo */}
                                                    <input
                                                        type="number"
                                                        placeholder="Quantidade perdida"
                                                        value={newReceita.quantidadePerdida}
                                                        onChange={(e) =>
                                                            setNewReceita({
                                                                ...newReceita,
                                                                quantidadePerdida: e.target.value,
                                                            })
                                                        }
                                                        className="mt-3 w-full rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                    />

                                                    {/* Produtos / Ingredientes */}
                                                    <div className="mt-5">
                                                        <h4 className="mb-3 text-md font-semibold">
                                                            Produtos utilizados
                                                        </h4>

                                                        {newReceita.ingredientes.map((ingrediente, index) => (
                                                            <div
                                                                key={index}
                                                                className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-4"
                                                            >
                                                                {/* Produto */}
                                                                <input
                                                                    type="text"
                                                                    placeholder="Produto"
                                                                    value={ingrediente.produto}
                                                                    onChange={(e) => {
                                                                        const ingredientes = [
                                                                            ...newReceita.ingredientes,
                                                                        ];

                                                                        ingredientes[index].produto =
                                                                            e.target.value;

                                                                        setNewReceita({
                                                                            ...newReceita,
                                                                            ingredientes,
                                                                        });
                                                                    }}
                                                                    className="rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                                    required
                                                                />

                                                                {/* Quantidade */}
                                                                <input
                                                                    type="number"
                                                                    placeholder="Quantidade"
                                                                    value={ingrediente.quantidade}
                                                                    onChange={(e) => {
                                                                        const ingredientes = [
                                                                            ...newReceita.ingredientes,
                                                                        ];

                                                                        ingredientes[index].quantidade =
                                                                            e.target.value;

                                                                        setNewReceita({
                                                                            ...newReceita,
                                                                            ingredientes,
                                                                        });
                                                                    }}
                                                                    className="rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                                    required
                                                                />

                                                                {/* Unidade */}
                                                                <select
                                                                    value={ingrediente.unidade}
                                                                    onChange={(e) => {
                                                                        const ingredientes = [
                                                                            ...newReceita.ingredientes,
                                                                        ];

                                                                        ingredientes[index].unidade =
                                                                            e.target.value;

                                                                        setNewReceita({
                                                                            ...newReceita,
                                                                            ingredientes,
                                                                        });
                                                                    }}
                                                                    className="rounded-lg border border-gray-700 bg-[#15102b] p-3"
                                                                    required
                                                                >
                                                                    <option value="">
                                                                        Unidade
                                                                    </option>
                                                                    <option value="KG">KG</option>
                                                                    <option value="GR">GR</option>
                                                                    <option value="L">L</option>
                                                                    <option value="ML">ML</option>
                                                                    <option value="DZ">DZ</option>
                                                                    <option value="UN">UN</option>
                                                                </select>

                                                                {/* Remover produto */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const ingredientes =
                                                                            newReceita.ingredientes.filter(
                                                                                (_, i) => i !== index
                                                                            );

                                                                        setNewReceita({
                                                                            ...newReceita,
                                                                            ingredientes,
                                                                        });
                                                                    }}
                                                                    className="rounded-lg border border-red-700 px-4 py-2 text-red-400 hover:bg-red-950"
                                                                >
                                                                    Remover
                                                                </button>
                                                            </div>
                                                        ))}

                                                        {/* Adicionar produto */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setNewReceita({
                                                                    ...newReceita,
                                                                    ingredientes: [
                                                                        ...newReceita.ingredientes,
                                                                        {
                                                                            produto: "",
                                                                            quantidade: "",
                                                                            unidade: "",
                                                                        },
                                                                    ],
                                                                })
                                                            }
                                                            className="mt-2 rounded-lg border border-gray-700 px-4 py-2 hover:bg-gray-800"
                                                        >
                                                            + Adicionar produto
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                </div>

                                <div className="mt-4 flex shrink-0 justify-end gap-3">

                                    <div className="mt-1 flex justify-end gap-3">

                                        <button
                                            type="button"
                                            onClick={() => setShowProductForm(false)}
                                            className="rounded-lg bg-gray-700 px-5 py-3 font-bold text-white transition hover:bg-gray-600"
                                        >
                                            Cancelar
                                        </button>

                                        <Button
                                            type="submit"
                                            className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                        >
                                            {editingIndex !== null ? "Salvar alterações" : "Cadastrar produto"}
                                        </Button>

                                    </div>
                                </div>

                            </form>

                    </div>

                </div>
            )}

        </div>

    )
}

export default Produtos;