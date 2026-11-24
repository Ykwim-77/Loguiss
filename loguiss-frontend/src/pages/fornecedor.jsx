import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Search, Building2 } from 'lucide-react';

import { formatarCPFCNPJ, formatarTelefone } from '../utils/validacoes';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { EntityCard } from '../components/card';

import api from '../services/api';

const fornecedorInicial = {
    cnpj: "",
    nome: "",
    endereco: { rua: "", bairro: "", numero: "", estado: "" },
    email: "",
    telefone: ""
};

function Fornecedor() {

    const [showFornecedorForm, setShowFornecedorForm] = useState(false);
    const [fornecedores, setFornecedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [newFornecedor, setNewFornecedor] = useState(fornecedorInicial);

    const filteredFornecedores = (fornecedores ?? [])
        .map((fornecedor, index) => ({ fornecedor, index }))
        .filter(({ fornecedor }) => {
            const texto = (fornecedor.nome ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    const fornecedores_api = async () => {
        try {
            const response = await api.get('/fornecedor/list_fornecedor');
            const lista = response.data.fornecedores;
            setFornecedores(Array.isArray(lista) ? lista : []);
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
            toast.error('Erro ao carregar fornecedores.');
            setFornecedores([]);
        }
    };

    useEffect(() => {
        fornecedores_api();
    }, []);

    // Atualiza um campo do endereço
    const setEndereco = (campo) => (e) =>
        setNewFornecedor({
            ...newFornecedor,
            endereco: { ...newFornecedor.endereco, [campo]: e.target.value }
        });

    const editFornecedor = (index, updatedFornecedor) => {
        setFornecedores((atuais) => {
            const atualizados = [...atuais];
            atualizados[index] = updatedFornecedor;
            return atualizados;
        });
    };

    const deleteFornecedor = (index) => {
        setFornecedores((atuais) => {
            const atualizados = [...atuais];
            atualizados.splice(index, 1);
            return atualizados;
        });
    };

    const salvarFornecedor = async () => {
        try {
            if (editingIndex !== null) {
                // TODO: trocar pela rota de atualização quando existir no backend
                editFornecedor(editingIndex, newFornecedor);
                toast.success("Fornecedor atualizado com sucesso!");
            } else {
                await api.post('/fornecedor/create_fornecedor', {
                    cnpj: newFornecedor.cnpj,
                    nome: newFornecedor.nome,
                    rua: newFornecedor.endereco.rua,
                    bairro: newFornecedor.endereco.bairro,
                    numero: newFornecedor.endereco.numero,
                    estado: newFornecedor.endereco.estado,
                    email: newFornecedor.email,
                    telefone: newFornecedor.telefone
                });

                await fornecedores_api();
                toast.success("Fornecedor cadastrado com sucesso!");
            }

            setEditingIndex(null);
            setShowFornecedorForm(false);
            setNewFornecedor(fornecedorInicial);

        } catch (error) {
            console.error('Erro ao salvar fornecedor:', error);
            toast.error("Não foi possível salvar o fornecedor.");
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
                            Fornecedores
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de fornecedores. Aqui você pode gerenciar os fornecedores cadastrados no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto bg-[#A3E635] p-3 text-[#111111] transition-colors hover:bg-[#BEF264]"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewFornecedor(fornecedorInicial);
                            setShowFornecedorForm(true);
                        }}
                    >
                        Adicionar novo fornecedor
                    </Button>
                </div>

                {/* Pesquisa */}
                <Inputs
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
                    {filteredFornecedores.length === 0 && (
                        <p className="text-[var(--text-secondary)]">
                            Nenhum fornecedor encontrado.
                        </p>
                    )}

                    {filteredFornecedores.map(({ fornecedor, index }) => (
                        <EntityCard
                            key={index}
                            titulo={fornecedor.nome}
                            icone={Building2}
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewFornecedor({
                                    ...fornecedorInicial,
                                    ...fornecedor,
                                    endereco: {
                                        ...fornecedorInicial.endereco,
                                        ...fornecedor.endereco
                                    }
                                });
                                setShowFornecedorForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir este fornecedor?")) {
                                    deleteFornecedor(index);
                                    toast.success("Fornecedor excluído com sucesso!");
                                }
                            }}
                        >
                            <p className="mt-1 text-[var(--text-secondary)]">
                                CNPJ: {fornecedor.cnpj}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Email: {fornecedor.email}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Telefone: {fornecedor.telefone}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Endereço: {fornecedor.endereco?.bairro}, {fornecedor.endereco?.rua}, {fornecedor.endereco?.numero}, {fornecedor.endereco?.estado}
                            </p>
                        </EntityCard>
                    ))}
                </div>
            </main>

            {/* Modal */}
            {showFornecedorForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-2xl border border-[#343434] bg-[#1B1B1B] p-6 shadow-2xl">

                        {/* Cabeçalho do modal */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#F5F5F5]">
                                    {editingIndex !== null ? "Editar fornecedor" : "Adicionar fornecedor"}
                                </h2>

                                <p className="mt-1 text-sm text-[#A3A3A3]">
                                    {editingIndex !== null
                                        ? "Atualize os dados do fornecedor."
                                        : "Preencha os dados do novo fornecedor."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowFornecedorForm(false)}
                                className="text-2xl text-[#A3A3A3] transition-colors hover:text-[#A3E635]"
                            >
                                ×
                            </button>
                        </div>

                        {/* Formulário */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                salvarFornecedor();
                            }}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <Inputs
                                    label="Nome do fornecedor"
                                    className="sm:col-span-2"
                                    value={newFornecedor.nome}
                                    onChange={(e) => setNewFornecedor({ ...newFornecedor, nome: e.target.value })}
                                    placeholder="Nome do fornecedor"
                                    required
                                />

                                <Inputs
                                    label="CNPJ"
                                    value={newFornecedor.cnpj}
                                    onChange={(e) => setNewFornecedor({ ...newFornecedor, cnpj: formatarCPFCNPJ(e.target.value) })}
                                    placeholder="Ex: 12.345.678/0001-00"
                                    required
                                />

                                <Inputs
                                    label="Email"
                                    type="email"
                                    value={newFornecedor.email}
                                    onChange={(e) => setNewFornecedor({ ...newFornecedor, email: e.target.value })}
                                    placeholder="Ex: contato@empresa.com"
                                    required
                                />

                                <Inputs
                                    label="Telefone"
                                    value={newFornecedor.telefone}
                                    onChange={(e) => setNewFornecedor({ ...newFornecedor, telefone: formatarTelefone(e.target.value) })}
                                    placeholder="Ex: (00) 00000-0000"
                                    required
                                />

                                <Inputs
                                    label="Rua"
                                    value={newFornecedor.endereco.rua}
                                    onChange={setEndereco('rua')}
                                    placeholder="Rua"
                                    required
                                />

                                <Inputs
                                    label="Bairro"
                                    value={newFornecedor.endereco.bairro}
                                    onChange={setEndereco('bairro')}
                                    placeholder="Bairro"
                                    required
                                />

                                <Inputs
                                    label="Número"
                                    value={newFornecedor.endereco.numero}
                                    onChange={setEndereco('numero')}
                                    placeholder="Número"
                                    required
                                />

                                <Inputs
                                    label="Estado"
                                    value={newFornecedor.endereco.estado}
                                    onChange={setEndereco('estado')}
                                    placeholder="Estado"
                                    required
                                />
                            </div>

                            {/* Botões */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-[#343434] pt-5">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="border border-[#404040] bg-[#292929] px-5 text-[#F5F5F5] transition-colors hover:bg-[#343434]"
                                    onClick={() => setShowFornecedorForm(false)}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="bg-[#A3E635] px-5 text-[#111111] transition-colors hover:bg-[#BEF264]"
                                >
                                    {editingIndex !== null ? "Salvar alterações" : "Cadastrar fornecedor"}
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