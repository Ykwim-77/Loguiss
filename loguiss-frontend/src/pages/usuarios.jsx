import { useState } from 'react';
import { toast } from 'sonner';

import { Search, User } from 'lucide-react';
import { formatarCPFCNPJ, formatarTelefone } from '../utils/validacoes';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { EntityCard } from '../components/card';
import { ButtonEye } from '../components/buttonEye';

function Usuarios() {

    const [showUsuariosForm, setShowUsuariosForm] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [visualizar_senha, setVisualizarSenha] = useState(false);
    const [visualizar_confirmar_senha, setVisualizarConfirmarSenha] = useState(false);

    const filteredUsuarios = usuarios
        .map((usuario, index) => ({ usuario, index }))
        .filter(({ usuario }) => {
            const texto = (usuario.desc ?? usuario.descricao ?? usuario.nome ?? "").toLowerCase();
            return texto.includes(appliedSearch.toLowerCase());
        });

    const [newUsuario, setNewUsuario] = useState({
        desc: "",
        email: "",
        senha: "",
        confirm_senha: "",
        telefone: "",
        cpf: "",
        tipo_usuario: ""
    });

    function validarConfirmarSenha(senha, confirmarSenha) {
        if (confirmarSenha.trim() === '') {
            return 'A confirmação da senha é obrigatória';
        }

        if (confirmarSenha !== senha) {
            return 'As senhas não coincidem';
        }

        return '';
    }

    const addNewUsuario = () => {

        setUsuarios((usuariosAtuais) => [
            ...usuariosAtuais,
            newUsuario
        ]);

        setShowUsuariosForm(false);

        setNewUsuario({
            desc: "",
            email: "",
            senha: "",
            confirm_senha: "",
            telefone: "",
            cpf: "",
            tipo_usuario: ""
        });
    };

    const editUsuario = (index, updatedUsuario) => {
        setUsuarios((usuariosAtuais) => {
            const usuariosAtualizados = [...usuariosAtuais];
            usuariosAtualizados[index] = updatedUsuario;
            return usuariosAtualizados;
        });
    };

    const deleteUsuario = (index) => {
        setUsuarios((usuariosAtuais) => {
            const usuariosAtualizados = [...usuariosAtuais];
            usuariosAtualizados.splice(index, 1);
            return usuariosAtualizados;
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
                            Usuários
                        </h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de usuários. Aqui você pode gerenciar os usuários cadastrados no sistema.
                        </p>
                    </div>

                    <Button
                        type="button"
                        className="mt-2 w-auto bg-[#A3E635] p-3 text-[#111111] transition-colors hover:bg-[#BEF264]"
                        onClick={() => {
                            setEditingIndex(null);
                            setNewUsuario({
                                desc: "",
                                email: "",
                                senha: "",
                                confirm_senha: "",
                                telefone: "",
                                cpf: "",
                                tipo_usuario: ""
                            });
                            setShowUsuariosForm(true);
                        }}
                    >
                        Adicionar novo usuário
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
                    {filteredUsuarios.length === 0 && (
                        <p className="text-[var(--text-secondary)]">
                            Nenhum usuário encontrado.
                        </p>
                    )}

                    {filteredUsuarios.map(({ usuario, index }) => (
                        <EntityCard
                            key={index}
                            desc={usuario.desc}
                            icon={<User className="mt-2 h-6 w-6 text-[var(--text-secondary)]" />}
                            onEdit={() => {
                                setEditingIndex(index);
                                setNewUsuario(usuario);
                                setShowUsuariosForm(true);
                            }}
                            onDelete={() => {
                                if (window.confirm("Deseja excluir este usuário?")) {
                                    deleteUsuario(index);
                                    toast.success("Usuário excluído com sucesso!");
                                }
                            }}
                        >
                            <p className="mt-1 text-[var(--text-secondary)]">
                                Email: {usuario.email}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Telefone: {usuario.telefone}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                CPF: {usuario.cpf}
                            </p>

                            <p className="mt-1 text-[var(--text-secondary)]">
                                Tipo de usuário: {usuario.tipo_usuario}
                            </p>
                        </EntityCard>
                    ))}
                </div>
            </main>

            {/* Modal */}
            {showUsuariosForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-2xl border border-[#343434] bg-[#1B1B1B] p-6 shadow-2xl">

                        {/* Cabeçalho do modal */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#F5F5F5]">
                                    {editingIndex !== null ? "Editar usuário" : "Adicionar usuário"}
                                </h2>

                                <p className="mt-1 text-sm text-[#A3A3A3]">
                                    {editingIndex !== null
                                        ? "Atualize os dados do usuário."
                                        : "Preencha os dados do novo usuário."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowUsuariosForm(false)}
                                className="text-2xl text-[#A3A3A3] transition-colors hover:text-[#A3E635]"
                            >
                                ×
                            </button>
                        </div>

                        {/* Formulário */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                const erro = validarConfirmarSenha(
                                    newUsuario.senha,
                                    newUsuario.confirm_senha
                                );

                                if (erro) {
                                    toast.error(erro);
                                    return;
                                }

                                if (editingIndex !== null) {
                                    editUsuario(editingIndex, newUsuario);
                                    toast.success("Usuário atualizado com sucesso!");
                                } else {
                                    addNewUsuario();
                                    toast.success("Usuário cadastrado com sucesso!");
                                }

                                setEditingIndex(null);
                                setShowUsuariosForm(false);
                            }}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <Inputs
                                    label="Nome do usuário"
                                    className="sm:col-span-2"
                                    value={newUsuario.desc}
                                    onChange={(e) =>
                                        setNewUsuario({
                                            ...newUsuario,
                                            desc: e.target.value
                                        })
                                    }
                                    placeholder="Nome do usuário"
                                    required
                                />

                                <Inputs
                                    type="email"
                                    value={newUsuario.email}
                                    onChange={(e) =>
                                        setNewUsuario({
                                            ...newUsuario,
                                            email: e.target.value
                                        })
                                    }
                                    placeholder="Ex: nomeusuario@dominio.com"
                                    className="w-full"
                                    required
                                />

                                <Inputs
                                    type={visualizar_senha ? 'text' : 'password'}
                                    placeholder="Senha"
                                    value={newUsuario.senha}
                                    onChange={(e) => setNewUsuario({ ...newUsuario, senha: e.target.value })}
                                    className="w-full"
                                    rightElement={
                                        <ButtonEye
                                            isOpen={visualizar_senha}
                                            onToggle={() => setVisualizarSenha((v) => !v)}
                                        />
                                    }
                                    required
                                />

                                <Inputs
                                    type={visualizar_confirmar_senha ? 'text' : 'password'}
                                    placeholder="Confirmar senha"
                                    value={newUsuario.confirm_senha}
                                    onChange={(e) => setNewUsuario({ ...newUsuario, confirm_senha: e.target.value })}
                                    className="w-full"
                                    rightElement={
                                        <ButtonEye
                                            isOpen={visualizar_senha}
                                            onToggle={() => setVisualizarSenha((v) => !v)}
                                        />
                                    }
                                    required
                                />

                                <Inputs
                                    type="text"
                                    value={newUsuario.telefone}
                                    onChange={(e) => setNewUsuario({ ...newUsuario, telefone: formatarTelefone(e.target.value) })}
                                    placeholder="Ex: (00) 00000-0000"
                                    className="w-full"
                                    required
                                />

                                <Inputs
                                    type="text"
                                    value={newUsuario.cpf}
                                    onChange={(e) => setNewUsuario({ ...newUsuario, cpf: formatarCPFCNPJ(e.target.value) })}
                                    placeholder="Ex: 123.456.789-00"
                                    className="w-full"
                                    required
                                />

                                <Inputs
                                    type="select"
                                    value={newUsuario.tipo_usuario}
                                    onChange={(e) =>
                                        setNewUsuario({
                                            ...newUsuario,
                                            tipo_usuario: e.target.value
                                        })
                                    }
                                    options={[
                                        { value: "Administrador", label: "Administrador" },
                                        { value: "Operador", label: "Operador" },
                                        { value: "Gerente", label: "Gerente" }
                                    ]}
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Botões */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-[#343434] pt-5">
                                <button
                                    type="button"
                                    onClick={() => setShowUsuariosForm(false)}
                                    className="rounded-lg border border-[#404040] bg-[#292929] px-5 py-3 font-bold text-[#F5F5F5] transition-colors hover:bg-[#343434]"
                                >
                                    Cancelar
                                </button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#A3E635] px-5 py-3 text-[#111111] transition-colors hover:bg-[#BEF264]"
                                >
                                    {editingIndex !== null ? "Salvar alterações" : "Cadastrar Usuário"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Usuarios;