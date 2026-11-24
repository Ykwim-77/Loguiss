
import { useState } from 'react';
import { toast } from 'sonner';

import { Search, Combine } from 'lucide-react';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { EntityCard } from '../components/card';

function UnidadesMedida() {

    const [showUnitForm, setShowUnitForm] = useState(false);
    const [units, setUnits] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    const filteredUnidades = units
        .map((unidade, index) => ({ unidade, index }))
        .filter(({ unidade }) => {
            const texto = (unidade.desc ?? unidade.descricao ?? unidade.nome ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    const [newUnit, setNewUnit] = useState({
        desc: "",
        gramatura: "",
        unidade: "",
        fgFracionavel: false
    });

    const addNewUnit = () => {
        if (editingIndex !== null) {
            editUnit(editingIndex, newUnit);
            toast.success("Unidade de medida atualizada com sucesso!");
        } else {
            setUnits((unidadesAtuais) => [
                ...unidadesAtuais,
                newUnit,
            ]);
            toast.success("Unidade de medida cadastrada com sucesso!");
        }

        setShowUnitForm(false);
        setEditingIndex(null);
        setNewUnit({
            desc: "",
            gramatura: "",
            unidade: "",
            fgFracionavel: false
        });
    };

    const editUnit = (index, updatedUnit) => {
        setUnits((unidadesAtuais) => {
            const unidadesAtualizadas = [...unidadesAtuais];
            unidadesAtualizadas[index] = updatedUnit;
            return unidadesAtualizadas;
        });
    };

    const deleteUnit = (index) => {
        setUnits((unidadesAtuais) => {
            const unidadesAtualizadas = [...unidadesAtuais];
            unidadesAtualizadas.splice(index, 1);
            return unidadesAtualizadas;
        });
    };

    return (

        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">

                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 mt-2 text-3xl font-bold text-[var(--text)]">
                            Unidades de Medida
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de unidades de medida. Aqui você pode gerenciar as unidades cadastradas no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto bg-[#A3E635] p-3 text-[#111111] hover:bg-[#BEF264]"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewUnit({
                                desc: "",
                                gramatura: "",
                                unidade: "",
                                fgFracionavel: false,
                            });
                            setShowUnitForm(true);
                        }}
                    >
                        Adicionar nova unidade de medida
                    </Button>
                </div>

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

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUnidades.length === 0 && (
                        <p className="text-gray-400">Nenhuma unidade de medida encontrada.</p>
                    )}
                    {filteredUnidades.map(({ unidade, index }) => (
                        <EntityCard
                            key={index}
                            desc={unidade.desc}
                            icon={<Combine className="mt-2 h-6 w-6 text-[var(--text-secondary)]" />}
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewUnit(unidade);
                                setShowUnitForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir esta unidade de medida?")) {
                                    deleteUnit(index);
                                    toast.success("Unidade de medida excluída com sucesso!");
                                }
                            }}
                        >
                            <p className="mt-1 text-[var(--text-secondary)]">
                                Gramatura: {unidade.gramatura}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Unidade: {unidade.unidade}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Fracionável: {unidade.fgFracionavel ? "Sim" : "Não"}
                            </p>
                        </EntityCard>
                    ))}
                </div>
            </main>

            {showUnitForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl border border-[#343434] bg-[#1B1B1B] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#F5F5F5]">
                                    {editingIndex !== null
                                        ? "Editar unidade de medida"
                                        : "Adicionar unidade de medida"}
                                </h2>

                                <p className="mt-1 text-sm text-[#A3A3A3]">
                                    Preencha os dados da nova unidade de medida.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowUnitForm(false)}
                                aria-label="Fechar"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-[#A3A3A3] transition-colors hover:bg-[#292929] hover:text-[#A3E635]"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addNewUnit();
                            }}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Inputs
                                    label="Descrição"
                                    className="sm:col-span-2"
                                    value={newUnit.desc}
                                    onChange={(e) =>
                                        setNewUnit({ ...newUnit, desc: e.target.value })
                                    }
                                    placeholder="Nome da unidade de medida"
                                    required
                                />

                                <Inputs
                                    label="Gramatura"
                                    value={newUnit.gramatura}
                                    onChange={(e) =>
                                        setNewUnit({ ...newUnit, gramatura: e.target.value })
                                    }
                                    placeholder="Ex: 500g"
                                    required
                                />

                                <Inputs
                                    label="Unidade"
                                    value={newUnit.unidade}
                                    onChange={(e) =>
                                        setNewUnit({ ...newUnit, unidade: e.target.value })
                                    }
                                    placeholder="Ex: UN, KG, L"
                                    required
                                />

                                <div>
                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#343434] bg-[#292929]/50 p-3 transition-colors hover:border-[#A3E635]/40">
                                        <input
                                            type="checkbox"
                                            checked={newUnit.fgFracionavel}
                                            onChange={(e) =>
                                                setNewUnit({ ...newUnit, fgFracionavel: e.target.checked })
                                            }
                                            className="h-5 w-5 accent-[#A3E635]"
                                        />

                                        <span className="text-sm text-[#F5F5F5]">
                                            {newUnit.fgFracionavel
                                                ? "Unidade fracionável"
                                                : "Unidade não fracionável"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-[#343434] pt-5">
                                <button
                                    type="button"
                                    onClick={() => setShowUnitForm(false)}
                                    className="rounded-lg border border-[#404040] bg-[#292929] px-5 py-3 font-semibold text-[#F5F5F5] transition hover:bg-[#343434]"
                                >
                                    Cancelar
                                </button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#A3E635] px-5 py-3 font-semibold text-[#111111] hover:bg-[#BEF264]"
                                >
                                    {editingIndex !== null
                                        ? "Salvar alterações"
                                        : "Cadastrar unidade"
                                    }
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnidadesMedida;
