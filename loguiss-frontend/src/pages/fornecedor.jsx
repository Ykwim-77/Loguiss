import { useState } from 'react';
import { toast } from 'sonner';

import { LayoutDashboard, Folder, Shuffle, Brain, Cog, Search, Building2 } from 'lucide-react';

import { formatarCPFCNPJ, formatarTelefone } from '../utils/validacoes';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { Card } from '../components/card';

function Fornecedor() {

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

    const [showFornecedorForm, setShowFornecedorForm] = useState(false);

    const [newFornecedor, setNewFornecedor] = useState({
        cnpj: "",
        nome: "",
        endereco: {
            rua: "",
            bairro: "",
            numero: "",
            estado: ""
        },
        email: "",
        telefone: ""
    });

    const [fornecedores, setFornecedores] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);

    // CRUD de fornecedores
    const addNewFornecedor = () => {
        setFornecedores((fornecedoresAtuais) => [
            ...fornecedoresAtuais,
            newFornecedor
        ]);

        setShowFornecedorForm(false);

        setNewFornecedor({
            cnpj: "",
            nome: "",
            endereco: {
                rua: "",
                bairro: "",
                numero: "",
                estado: ""
            },
            email: "",
            telefone: ""
        });
    };

    const editFornecedor = (index, updatedFornecedor) => {
        setFornecedores((fornecedoresAtuais) => {
            const fornecedoresAtualizados = [...fornecedoresAtuais];

            fornecedoresAtualizados[index] = updatedFornecedor;

            return fornecedoresAtualizados;
        });
    };

    const deleteFornecedor = (index) => {
        setFornecedores((fornecedoresAtuais) => {
            const fornecedoresAtualizados = [...fornecedoresAtuais];

            fornecedoresAtualizados.splice(index, 1);

            return fornecedoresAtualizados;
        });
    };

    const filteredFornecedores = fornecedores
        .map((fornecedor, index) => ({ fornecedor, index }))
        .filter(({ fornecedor }) =>
            fornecedor.nome
                .toLowerCase()
                .includes(appliedSearch.toLowerCase())
        );

    return (

        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar menuItems={menuItems} />

            <main className="ml-72 min-h-screen p-5">

                <div className="flex items-center justify-between mb-3">

                    <div>

                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Fornecedores
                        </h1>

                        <p className="text-gray-400">
                            Esta é a página de fornecedores. Aqui você pode gerenciar os fornecedores cadastrados no sistema.
                        </p>

                    </div>

                    <Button
                        type="button"
                        className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto mt-2"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewFornecedor({
                                cnpj: "",
                                nome: "",
                                endereco: {
                                    rua: "",
                                    bairro: "",
                                    numero: "",
                                    estado: ""
                                },
                                email: "",
                                telefone: ""
                            });

                            setShowFornecedorForm(true);
                        }}
                    >
                        Adicionar novo fornecedor
                    </Button>

                </div>

                <div className="flex items-center justify-between">

                    <Inputs
                        type="text"
                        placeholder="Pesquisar fornecedores..."
                        className="mt-5 rounded-lg border bg-[#15102b] p-3 focus:border-[#4EDB4E] w-1/2"
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                e.preventDefault();

                                setAppliedSearch(searchTerm);
                            }

                        }}
                    />

                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                    {filteredFornecedores.map(({ fornecedor, index }) => (

                        <Card
                            key={index}
                            desc={fornecedor.nome}
                            icon={
                                <Building2 className="h-6 w-6 mt-2 text-gray-400" />
                            }
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewFornecedor(fornecedor);
                                setShowFornecedorForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir este fornecedor?")) {
                                    deleteFornecedor(index);
                                    toast.success(
                                        "Fornecedor excluído com sucesso!"
                                    );
                                }

                            }}
                        >

                            <p className="mt-2 text-gray-400">
                                Nome: {fornecedor.nome}
                            </p>

                            <p className="mt-1 text-gray-400">
                                CNPJ: {fornecedor.cnpj}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Email: {fornecedor.email}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Telefone: {fornecedor.telefone}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Endereço: {fornecedor.endereco.bairro}, {fornecedor.endereco.rua}, {fornecedor.endereco.numero}, {fornecedor.endereco.estado}
                            </p>

                        </Card>

                    ))}

                </div>

            </main>

            {showFornecedorForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">

                    <div className="w-full max-w-2xl rounded-xl bg-[#050210] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-bold">

                                    {editingIndex !== null
                                        ? "Editar fornecedor"
                                        : "Adicionar fornecedor"}

                                </h2>

                                <p className="mt-1 text-sm text-gray-400">

                                    {editingIndex !== null
                                        ? "Atualize os dados do fornecedor."
                                        : "Preencha os dados do novo fornecedor."}

                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setShowFornecedorForm(false)}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (editingIndex !== null) {
                                    editFornecedor(
                                        editingIndex,
                                        newFornecedor
                                    );
                                    toast.success(
                                        "Fornecedor atualizado com sucesso!"
                                    );
                                }
                                else {
                                    addNewFornecedor();
                                    toast.success(
                                        "Fornecedor cadastrado com sucesso!"
                                    );
                                }
                                setEditingIndex(null);
                                setShowFornecedorForm(false);
                            }}
                        >

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="sm:col-span-2">

                                    <label className="mb-1 block text-sm font-medium">
                                        Nome do fornecedor
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newFornecedor.nome}
                                        onChange={(e) =>
                                            setNewFornecedor({
                                                ...newFornecedor,
                                                nome: e.target.value
                                            })
                                        }
                                        placeholder="Nome do fornecedor"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        CNPJ
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newFornecedor.cnpj}
                                        onChange={(e) =>
                                            setNewFornecedor({
                                                ...newFornecedor,
                                                cnpj: formatarCPFCNPJ(
                                                    e.target.value
                                                )
                                            })
                                        }
                                        placeholder="Ex: 12.345.678/0001-00"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Email
                                    </label>

                                    <Inputs
                                        type="email"
                                        value={newFornecedor.email}
                                        onChange={(e) =>
                                            setNewFornecedor({
                                                ...newFornecedor,
                                                email: e.target.value
                                            })
                                        }
                                        placeholder="Ex: contato@empresa.com"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Telefone
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newFornecedor.telefone}
                                        onChange={(e) =>
                                            setNewFornecedor({
                                                ...newFornecedor,
                                                telefone: formatarTelefone(
                                                    e.target.value
                                                )
                                            })
                                        }
                                        placeholder="Ex: (00) 00000-0000"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Rua
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newFornecedor.endereco.rua}
                                        onChange={(e) =>
                                            setNewFornecedor({
                                                ...newFornecedor,
                                                endereco: {
                                                    ...newFornecedor.endereco,
                                                    rua: e.target.value
                                                }
                                            })
                                        }
                                        placeholder="Rua"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Bairro
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newFornecedor.endereco.bairro}
                                        onChange={(e) =>
                                            setNewFornecedor({
                                                ...newFornecedor,
                                                endereco: {
                                                    ...newFornecedor.endereco,
                                                    bairro: e.target.value
                                                }
                                            })
                                        }
                                        placeholder="Bairro"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Número
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newFornecedor.endereco.numero}
                                        onChange={(e) =>
                                            setNewFornecedor({
                                                ...newFornecedor,
                                                endereco: {
                                                    ...newFornecedor.endereco,
                                                    numero: e.target.value
                                                }
                                            })
                                        }
                                        placeholder="Número"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-medium">
                                        Estado
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newFornecedor.endereco.estado}
                                        onChange={(e) =>
                                            setNewFornecedor({
                                                ...newFornecedor,
                                                endereco: {
                                                    ...newFornecedor.endereco,
                                                    estado: e.target.value
                                                }
                                            })
                                        }
                                        placeholder="Estado"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowFornecedorForm(false)
                                    }
                                    className="rounded-lg bg-gray-700 px-5 py-3 font-bold text-white transition hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                >
                                    {editingIndex !== null
                                        ? "Salvar alterações"
                                        : "Cadastrar fornecedor"}
                                </Button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Fornecedor;