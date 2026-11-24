import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Search, Layers2 } from 'lucide-react';
import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { EntityCard } from '../components/card';

import api from '../services/api';

function Categorias() {

    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    const filteredCategories = (categories ?? [])
        .map((categoria, index) => ({ categoria, index }))
        .filter(({ categoria }) => {
            const texto = (categoria.desc ?? categoria.descricao ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    const [newCategory, setNewCategory] = useState({
        desc: "",
    });

    const addNewCategory = async () => {
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

        const create_categoria = await api.post('/categoria/create_categoria', {
            descricao: newCategory.desc
        });

        categoria_api();
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

    const categoria_api = async () => {
        try {
            const response = await api.get('/categoria/list_categorias');
            console.log('Retorno da API:', response.data);

            const categoriasRecebidas = response.data.categorias;

            setCategories(
                Array.isArray(categoriasRecebidas)
                    ? categoriasRecebidas
                    : []
            );
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            toast.error('Erro ao carregar categorias.');
            setCategories([]);
        }
    };

    useEffect(() => {
        categoria_api();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">

                {/* Cabeçalho */}
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold text-[var(--text)]">
                            Categorias
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de categorias. Aqui você pode gerenciar as categorias cadastradas no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto bg-[#A3E635] p-3 text-[#111111] transition-colors hover:bg-[#BEF264]"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewCategory({ desc: "" });
                            setShowCategoryForm(true);
                        }}
                    >
                        Adicionar nova categoria
                    </Button>
                </div>

                {/* Pesquisa */}
                <Inputs
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            setAppliedSearch(searchTerm.trim());
                        }
                    }}
                    className="mt-5 w-1/2"
                    icon={Search}
                />

                {/* Cards */}
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.length === 0 && (
                        <p className="text-gray-400">Nenhuma categoria encontrada.</p>
                    )}
                    {filteredCategories.map(({ categoria, index }) => (
                        <EntityCard
                            key={index}
                            titulo={categoria.descricao ?? categoria.desc ?? "Sem Descrição"}
                            icone={Layers2}
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
                        />
                    ))}
                </div>
            </main>

            {/* Modal */}
            {showCategoryForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-2xl border border-[#343434] bg-[#1B1B1B] p-6 shadow-2xl">

                        <div className="mb-2 flex items-center justify-between ">
                            <div>
                                <h2 className="text-2xl font-bold text-[#F5F5F5]">
                                    {editingIndex !== null ? "Editar categoria" : "Adicionar categoria"}
                                </h2>

                                <p className="mt-1 text-sm text-[#A3A3A3]">
                                    Preencha os dados da nova categoria.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCategoryForm(false)}
                                className="text-2xl text-[#A3A3A3] transition-colors hover:text-[#A3E635]"
                            >
                                ×
                            </button>
                        </div>

                        {/* Formulário */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addNewCategory();
                            }}
                            className="p-6"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Inputs
                                    label="Descrição"
                                    className="sm:col-span-2"
                                    value={newCategory.desc}
                                    onChange={(e) => setNewCategory({ ...newCategory, desc: e.target.value })}
                                    placeholder="Nome da categoria"
                                    required
                                />
                            </div>

                            {/* Botões */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-[#343434] pt-5">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="border border-[#404040] bg-[#292929] px-5 text-[#F5F5F5] transition-colors hover:bg-[#343434]"
                                    onClick={() => setShowCategoryForm(false)}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="bg-[#A3E635] px-5 text-[#111111] transition-colors hover:bg-[#BEF264]"
                                >
                                    {editingIndex !== null ? "Salvar alterações" : "Cadastrar categoria"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Categorias;