import { useState } from 'react';
import { toast } from 'sonner';

import { LayoutDashboard, Folder, Shuffle, Brain, Cog, Search, User } from 'lucide-react';
import { formatarCPFCNPJ, formatarTelefone } from '../utils/validacoes';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button'
import { Inputs } from '../components/inputs';
import { Card } from '../components/card';
import { ButtonEye } from '../components/buttonEye';

function Usuarios() {

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

    const [showUsuariosForm, setShowUsuariosForm] = useState(false);

    const [newUsuario, setNewUsuario] = useState({
        desc: "",
        email: "",
        senha: "",
        confirm_senha: "",
        telefone: "",
        cpf: "",
        tipo_usuario: ""
    });

    //CRUD de usuários
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

    const [usuarios, setUsuarios] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [visualizar_senha, setVisualizarSenha] = useState(false);
    const [visualizar_confirmar_senha, setVisualizarConfirmarSenha] = useState(false);
    const filteredUsuarios = usuarios
        .map((usuario, index) => ({ usuario, index }))
        .filter(({ usuario }) =>
            usuario.desc.toLowerCase().includes(appliedSearch.toLowerCase())
        );

    return (

        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar menuItems={menuItems} />

            <main className="ml-72 min-h-screen p-5">

                <div className="flex items-center justify-between mb-3">

                    <div> {/* Agrupa o título e a descrição para separá-los do botão no layout flex */}

                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Usuários
                        </h1>

                        <p className="text-gray-400">
                            Esta é a página de usuários. Aqui você pode gerenciar os usuários cadastrados no sistema.
                        </p>

                    </div>

                    {/*Adicionar novo usuário*/}
                    <Button
                        type="button"
                        className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto mt-2"
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

                <div className="flex items-center justify-between">

                    <Inputs
                        type="text"
                        placeholder="Pesquisar usuários..."
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

                {/*Card de usuários*/}
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUsuarios.map(({ usuario, index }) => (
                        <Card
                            key={index}
                            desc={usuario.desc}
                            icon={<User className="h-6 w-6 mt-2 text-gray-400" />}
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

                            <p className="mt-2 text-gray-400">
                                Nome: {usuario.desc}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Email: {usuario.email}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Telefone: {usuario.telefone}
                            </p>

                            <p className="mt-1 text-gray-400">
                                CPF: {usuario.cpf}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Tipo de usuário: {usuario.tipo_usuario}
                            </p>

                        </Card>
                    ))}

                </div>

            </main>

            {/*Formulário de Usuários*/}
            {showUsuariosForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">

                    <div className="w-full max-w-2xl rounded-xl bg-[#050210] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {editingIndex !== null ? "Editar usuário" : "Adicionar usuário"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    {editingIndex !== null
                                        ? "Atualize os dados do usuário."
                                        : "Preencha os dados do novo usuário."}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => setShowUsuariosForm(false)}
                                className="text-2xl text-gray-400 hover:text-white"
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                if (editingIndex !== null) {
                                    editUsuario(editingIndex, newUsuario);
                                    toast.success("Usuário atualizado com sucesso!");
                                }
                                else {
                                    addNewUsuario();
                                    toast.success("Usuário cadastrado com sucesso!");
                                }

                                setEditingIndex(null);
                                setShowUsuariosForm(false);
                            }}
                        >

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium">
                                        Nome do usuário
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newUsuario.desc}
                                        onChange={(e) =>
                                            setNewUsuario({
                                                ...newUsuario,
                                                desc: e.target.value
                                            })
                                        }
                                        placeholder="Nome do usuário"
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
                                        value={newUsuario.email}
                                        onChange={(e) =>
                                            setNewUsuario({
                                                ...newUsuario,
                                                email: e.target.value
                                            })
                                        }
                                        placeholder="Ex: nomeusuario@dominio.com"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Senha
                                    </label>

                                    <Inputs
                                        type={visualizar_senha ? 'text' : 'password'}
                                        placeholder="Senha"
                                        value={newUsuario.senha}
                                        onChange={(e) => setNewUsuario({ ...newUsuario, senha: e.target.value })}
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        rightElement={
                                            <ButtonEye
                                                visualizar_senha={visualizar_senha}
                                                setVisualizarSenha={setVisualizarSenha}
                                            />
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Confirmar senha
                                    </label>

                                    <Inputs
                                        type={visualizar_confirmar_senha ? 'text' : 'password'}
                                        placeholder="Confirmar senha"
                                        value={newUsuario.confirm_senha}
                                        onChange={(e) => setNewUsuario({ ...newUsuario, confirm_senha: e.target.value })}
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        rightElement={
                                            <ButtonEye
                                                visualizar_senha={visualizar_confirmar_senha}
                                                setVisualizarSenha={setVisualizarConfirmarSenha}
                                            />
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Telefone
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newUsuario.telefone}
                                        onChange={(e) => setNewUsuario({ ...newUsuario, telefone: formatarTelefone(e.target.value) })}
                                        placeholder="Ex: (00) 00000-0000"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        CPF
                                    </label>

                                    <Inputs
                                        type="text"
                                        value={newUsuario.cpf}
                                        onChange={(e) => setNewUsuario({ ...newUsuario, cpf: formatarCPFCNPJ(e.target.value) })}
                                        placeholder="Ex: 123.456.789-00"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Tipo de usuário
                                    </label>

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
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setShowUsuariosForm(false)}
                                    className="rounded-lg bg-gray-700 px-5 py-3 font-bold text-white transition hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                >
                                    {editingIndex !== null ? "Salvar alterações" : "Cadastrar Usuário"}
                                </Button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>

    )
}

export default Usuarios;