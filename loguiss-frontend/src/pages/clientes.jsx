import { useState } from 'react';
import { toast } from 'sonner';

import { Search, User } from 'lucide-react';
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

    const filteredClientes = clientes
        .map((cliente, index) => ({ cliente, index }))
        .filter(({ cliente }) => {
            const texto = (cliente.desc ?? cliente.descricao ?? cliente.nome ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    const clienteInicial = {
        desc: "",
        email: "",
        telefone: "",
        cpf: "",
        dt_nasc: "",
        endereco: { rua: "", bairro: "", numero: "", estado: "" },
    };

    const [newCliente, setNewCliente] = useState(clienteInicial);

    const addNewCliente = () => {

        setClientes((clientesAtuais) => [
            ...clientesAtuais,
            newCliente
        ]);

        setShowClientesForm(false);

        setNewCliente({
            desc: "",
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
    };

    const editCliente = (index, updatedCliente) => {
        setClientes((clientesAtuais) => {
            const clientesAtualizados = [...clientesAtuais];
            clientesAtualizados[index] = updatedCliente;
            return clientesAtualizados;
        });
    };

    const deleteCliente = (index) => {
        setClientes((clientesAtuais) => {
            const clientesAtualizados = [...clientesAtuais];
            clientesAtualizados.splice(index, 1);
            return clientesAtualizados;
        });
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
                            setEditingIndex(null);
                            setNewCliente(clienteInicial);
                            setShowClientesForm(true);
                        }}
                    >
                        Adicionar novo cliente
                    </Button>
                </div>

                {/* Pesquisa */}
                <div className="flex items-center justify-between">
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
                </div>

                {/* Cards */}
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredClientes.length === 0 && (
                        <p className="text-gray-400">Nenhum cliente encontrado.</p>
                    )}
                    {filteredClientes.map(({ cliente, index }) => (
                        <EntityCard
                            titulo={cliente.desc}
                            key={index}
                            icone={User}
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewCliente(cliente);
                                setShowClientesForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir este cliente?")) {
                                    deleteCliente(index);
                                    toast.success("Cliente excluído com sucesso!");
                                }
                            }}
                        >
                            <p className="mt-1 text-[var(--text-secondary)]">
                                Email: {cliente.email}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Telefone: {cliente.telefone}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
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

                        {/* Cabeçalho do modal */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#F5F5F5]">
                                    {editingIndex !== null ? "Editar cliente" : "Adicionar cliente"}
                                </h2>

                                <p className="mt-1 text-sm text-[#A3A3A3]">
                                    {editingIndex !== null
                                        ? "Atualize os dados do cliente."
                                        : "Preencha os dados do novo cliente."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowClientesForm(false)}
                                className="text-2xl text-[#A3A3A3] transition-colors hover:text-[#A3E635]"
                            >
                                ×
                            </button>
                        </div>

                        {/* Formulário */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                if (editingIndex !== null) {
                                    editCliente(editingIndex, newCliente);
                                    toast.success("Cliente atualizado com sucesso!");
                                } else {
                                    setClientes((atuais) => [...atuais, newCliente]);
                                    setNewCliente(clienteInicial);
                                    toast.success("Cliente cadastrado com sucesso!");
                                }

                                setEditingIndex(null);
                                setShowClientesForm(false);
                            }}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <Inputs
                                    label="Nome do cliente"
                                    className="sm:col-span-2"
                                    value={newCliente.desc}
                                    onChange={(e) => setNewCliente({ ...newCliente, desc: e.target.value })}
                                    placeholder="Nome do cliente"
                                    required
                                />

                                <Inputs
                                    label="Email"
                                    type="email"
                                    value={newCliente.email}
                                    onChange={(e) => setNewCliente({ ...newCliente, email: e.target.value })}
                                    placeholder="Ex: nomecliente@dominio.com"
                                    required
                                />

                                <Inputs
                                    label="Telefone"
                                    value={newCliente.telefone}
                                    onChange={(e) => setNewCliente({ ...newCliente, telefone: formatarTelefone(e.target.value) })}
                                    placeholder="Ex: (00) 00000-0000"
                                    required
                                />

                                <Inputs
                                    label="CPF | CNPJ"
                                    value={newCliente.cpf}
                                    onChange={(e) => setNewCliente({ ...newCliente, cpf: formatarCPFCNPJ(e.target.value) })}
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
                                    onClick={() => setShowClientesForm(false)}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#A3E635] px-5 py-3 text-[#111111] transition-colors hover:bg-[#BEF264]"
                                >
                                    {editingIndex !== null ? "Salvar alterações" : "Cadastrar Cliente"}
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