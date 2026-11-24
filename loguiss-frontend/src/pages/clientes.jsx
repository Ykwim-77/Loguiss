
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Search, User } from 'lucide-react';

import api from '../services/api';
import { formatarCPFCNPJ, formatarTelefone } from '../utils/validacoes';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { EntityCard } from '../components/card';

function Clientes() {

    const [showClientesForm, setShowClientesForm] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);

    const [newCliente, setNewCliente] = useState({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        dt_nasc: "",
        endereco: {
            rua: "",
            bairro: "",
            numero: "",
            estado: ""
        }
    });

    const filteredClientes = (clientes ?? [])
        .map((cliente, index) => ({ cliente, index }))
        .filter(({ cliente }) => {
            const texto = (cliente.nome ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    // Listar clientes
    const cliente_api = async () => {
        try {
            const response = await api.get('/cliente/list_clientes');

            setClientes(
                Array.isArray(response.data.Clientes)
                    ? response.data.Clientes
                    : []
            );

        } catch (error) {
            console.error("Erro ao buscar clientes:", error.response?.data || error);
            toast.error("Erro ao carregar clientes!");
        }
    };

    useEffect(() => {
        cliente_api();
    }, []);

    // Limpar formulário
    const resetCliente = () => {
        setNewCliente({
            nome: "",
            email: "",
            telefone: "",
            cpf: "",
            dt_nasc: "",
            endereco: {
                rua: "",
                bairro: "",
                numero: "",
                estado: ""
            }
        });

        setEditingIndex(null);
    };

    // Adicionar cliente
    const addNewCliente = async () => {
        try {
            await api.post('/cliente/create_cliente', {
                nome: newCliente.nome,
                email: newCliente.email,
                telefone: newCliente.telefone,
                cpf: newCliente.cpf
            });

            await cliente_api();

            setShowClientesForm(false);
            resetCliente();

            toast.success("Cliente cadastrado com sucesso!");

        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error.response?.data || error);
            toast.error(error.response?.data?.MSG || "Erro ao cadastrar cliente!");
        }
    };

    // Editar cliente
    const editCliente = async (id, updatedCliente) => {
        try {
            await api.patch('/cliente/edit_cliente', {
                id_cliente: id,
                nome: updatedCliente.nome,
                email: updatedCliente.email,
                telefone: updatedCliente.telefone,
                cpf: updatedCliente.cpf
            });

            await cliente_api();

            setShowClientesForm(false);
            resetCliente();

            toast.success("Cliente atualizado com sucesso!");

        } catch (error) {
            console.error("Erro ao atualizar cliente:", error.response?.data || error);
            toast.error(error.response?.data?.MSG || "Erro ao atualizar cliente!");
        }
    };

    // Excluir cliente
    const deleteCliente = async (id) => {
        try {
            await api.delete(`/cliente/delete_cliente/${id}`);

            await cliente_api();

            toast.success("Cliente excluído com sucesso!");

        } catch (error) {
            console.error("Erro ao excluir cliente:", error.response?.data || error);
            toast.error("Erro ao excluir cliente!");
        }
    };

    // Abrir edição
    const onEdit = (cliente) => {
        setEditingIndex(cliente.id_cliente);

        setNewCliente({
            ...cliente,
            endereco: {
                rua: cliente.endereco?.rua ?? "",
                bairro: cliente.endereco?.bairro ?? "",
                numero: cliente.endereco?.numero ?? "",
                estado: cliente.endereco?.estado ?? ""
            }
        });

        setShowClientesForm(true);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">

            <SideBar />

            <main className="ml-72 min-h-screen p-5">

                {/* Cabeçalho */}
                <div className="mb-3 flex items-center justify-between">

                    <div>
                        <h1 className="mt-2 mb-2 text-3xl font-bold text-[var(--text)]">
                            Clientes
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de clientes. Aqui você pode gerenciar os clientes cadastrados no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto bg-[#A3E635] p-3 text-[#111111] transition-colors hover:bg-[#BEF264]"
                        onClick={() => {
                            resetCliente();
                            setShowClientesForm(true);
                        }}
                    >
                        Adicionar novo cliente
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

                    {filteredClientes.length === 0 && (
                        <p className="text-gray-400">
                            Nenhum cliente encontrado.
                        </p>
                    )}

                    {filteredClientes.map(({ cliente }) => (
                        <EntityCard
                            key={cliente.id_cliente}
                            titulo={cliente.nome}
                            icone={User}
                            onEdit={() => onEdit(cliente)}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir este cliente?")) {
                                    deleteCliente(cliente.id_cliente);
                                }
                            }}
                        >
                            <p className="mt-1 text-gray-400">
                                Email: {cliente.email}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Telefone: {cliente.telefone}
                            </p>

                            <p className="mt-1 text-gray-400">
                                CPF | CNPJ: {cliente.cpf}
                            </p>
                        </EntityCard>
                    ))}

                </div>

            </main>

            {/* Modal */}
            {showClientesForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-2xl border border-[#343434] bg-[#1B1B1B] p-6 shadow-2xl">

                        <div className="mb-2 flex items-center justify-between">

                            <div>
                                <h2 className="text-2xl font-bold text-[#F5F5F5]">
                                    {editingIndex !== null
                                        ? "Editar cliente"
                                        : "Adicionar cliente"}
                                </h2>

                                <p className="mt-1 text-sm text-[#A3A3A3]">
                                    {editingIndex !== null
                                        ? "Atualize os dados do cliente."
                                        : "Preencha os dados do novo cliente."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowClientesForm(false);
                                    resetCliente();
                                }}
                                className="text-2xl text-[#A3A3A3] transition-colors hover:text-[#A3E635]"
                            >
                                ×
                            </button>

                        </div>

                        {/* Formulário */}
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();

                                if (editingIndex !== null) {
                                    await editCliente(editingIndex, newCliente);
                                } else {
                                    await addNewCliente();
                                }
                            }}
                            className="p-6"
                        >

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <Inputs
                                    label="Nome do cliente"
                                    className="sm:col-span-2"
                                    value={newCliente.nome}
                                    onChange={(e) =>
                                        setNewCliente({
                                            ...newCliente,
                                            nome: e.target.value
                                        })
                                    }
                                    placeholder="Nome do cliente"
                                    required
                                />

                                <Inputs
                                    label="Email"
                                    type="email"
                                    value={newCliente.email}
                                    onChange={(e) =>
                                        setNewCliente({
                                            ...newCliente,
                                            email: e.target.value
                                        })
                                    }
                                    placeholder="Ex: nomecliente@dominio.com"
                                    required
                                />

                                <Inputs
                                    label="Telefone"
                                    type="text"
                                    value={newCliente.telefone}
                                    onChange={(e) =>
                                        setNewCliente({
                                            ...newCliente,
                                            telefone: formatarTelefone(e.target.value)
                                        })
                                    }
                                    placeholder="Ex: (00) 00000-0000"
                                    required
                                />

                                <Inputs
                                    label="CPF | CNPJ"
                                    type="text"
                                    value={newCliente.cpf}
                                    onChange={(e) =>
                                        setNewCliente({
                                            ...newCliente,
                                            cpf: formatarCPFCNPJ(e.target.value)
                                        })
                                    }
                                    placeholder="Ex: 123.456.789-00"
                                    required
                                />

                            </div>

                            {/* Botões */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-[#343434] pt-5">

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="border border-[#404040] bg-[#292929] px-5 text-[#F5F5F5] transition-colors hover:bg-[#343434]"
                                    onClick={() => {
                                        setShowClientesForm(false);
                                        resetCliente();
                                    }}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="bg-[#A3E635] px-5 text-[#111111] transition-colors hover:bg-[#BEF264]"
                                >
                                    {editingIndex !== null
                                        ? "Salvar alterações"
                                        : "Cadastrar cliente"}
                                </Button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Clientes;
