import { useState } from 'react';
import { toast } from 'sonner';

import { LayoutDashboard, Folder, Shuffle, Brain, Cog, Search, Layers2 } from 'lucide-react';
import { SideBar } from '../components/sidebar';
import { Button } from '../components/button'
import { Inputs } from '../components/inputs';
import { Card } from '../components/card';

function Categorias() {

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

    const [showCategoryForm, setShowCategoryForm] = useState(false);

    const [newCategory, setNewCategory] = useState({
        desc: "",
    });

    //CRUD de categorias
    const addNewCategory = () => {
        if (editingIndex !== null) {
            editCategory(editingIndex, newCategory);
            toast.success("Categoria atualizada com sucesso!");
        } else {
            setCategories((categoriasAtuais) => [
                ...categoriasAtuais,
                newCategory,
            ]);
            toast.success("Categoria cadastrada com sucesso!");
        }

        setShowCategoryForm(false);
        setEditingIndex(null);
        setNewCategory({ desc: "" });
    };

    const editCategory = (index, updatedCategory) => {
        setCategories((categoriasAtuais) => {
            const categoriasAtualizadas = [...categoriasAtuais];
            categoriasAtualizadas[index] = updatedCategory;
            return categoriasAtualizadas;
        });
    };

    const deleteCategory = (index) => {
        setCategories((categoriasAtuais) => {
            const categoriasAtualizadas = [...categoriasAtuais];
            categoriasAtualizadas.splice(index, 1);
            return categoriasAtualizadas;
        });
    };

    const [categories, setCategories] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCategories = categories
        .map((categoria, index) => ({ categoria, index }))
        .filter(({ categoria }) =>
            categoria.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (

        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar menuItems={menuItems} />

            <main className="ml-72 min-h-screen p-5">

                <div className="flex items-center justify-between mb-3">

                    <div> {/* Agrupa o título e a descrição para separá-los do botão no layout flex */}

                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Categorias
                        </h1>

                        <p className="text-gray-400">
                            Esta é a página de categorias. Aqui você pode gerenciar as categorias cadastradas no sistema.
                        </p>

                    </div>

                    <Button
                        type="button"
                        className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto mt-2"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewCategory({ desc: "" });
                            setShowCategoryForm(true);
                        }}
                    >
                        Adicionar nova categoria
                    </Button>

                </div>

                <Inputs
                    type="text"
                    placeholder="Pesquisar categorias..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    className="mt-5 w-1/2 rounded-lg border bg-[#15102b] p-3 focus:border-[#4EDB4E]"
                    icon={Search}
                />

                {/*Card de categorias*/}
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.map(({ categoria, index }) => (
                        <Card
                            key={index}
                            desc={categoria.desc}
                            icon={<Layers2 className="h-6 w-6 mt-2 text-gray-400" />}
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewCategory(categoria);
                                setShowCategoryForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir esta categoria?")) {
                                    deleteCategory(index);
                                    toast.success("Categoria excluída com sucesso!");
                                }
                            }}
                        >
                            <p className="mt-2 text-gray-400">
                                Categoria: {categoria.desc}
                            </p>

                        </Card>
                    ))}

                </div>

            </main>

            {showCategoryForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

                    <div className="w-full max-w-2xl rounded-xl bg-[#0d0920] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {editingIndex !== null ? "Editar categoria" : "Adicionar categoria"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Preencha os dados da nova categoria.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCategoryForm(false)}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addNewCategory();
                            }}
                        >

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium">
                                        Descrição
                                    </label>

                                    <input
                                        type="text"
                                        value={newCategory.desc}
                                        onChange={(e) =>
                                            setNewCategory({
                                                ...newCategory,
                                                desc: e.target.value
                                            })
                                        }
                                        placeholder="Nome da categoria"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setShowCategoryForm(false)}
                                    className="rounded-lg bg-gray-700 px-5 py-3 font-bold text-white transition hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                >
                                    {editingIndex !== null ? "Salvar alterações" : "Cadastrar categoria"}
                                </Button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>

    )
}

export default Categorias;