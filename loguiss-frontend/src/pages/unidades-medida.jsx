import { useState } from 'react';

import { LayoutDashboard, Folder, Shuffle, Brain, Cog, Search } from 'lucide-react';
import { SideBar } from '../components/sidebar';
import { Button } from '../components/button'
import { Inputs } from '../components/inputs';

function UnidadesMedida() {

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

    const [showUnitForm, setShowUnitForm] = useState(false);

    const [newUnit, setNewUnit] = useState({
        desc: "",
        gramatura: "",
        unidade: "",
        fgFracionavel: false,
    });

    //CRUD de unidades de medida
    const addNewUnit = () => {

        setUnits((unidadesAtuais) => [
            ...unidadesAtuais,
            newUnit
        ]);

        setShowUnitForm(false);

        setNewUnit({
            desc: "",
            gramatura: "",
            unidade: "",
            fgFracionavel: false,
        });
    };

    const [units, setUnits] = useState([]);

    return (

        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar menuItems={menuItems} />

            <main className="ml-72 min-h-screen p-5">

                <div className="flex items-center justify-between mb-3">

                    <div> {/* Agrupa o título e a descrição para separá-los do botão no layout flex */}

                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Unidades de Medida
                        </h1>

                        <p className="text-gray-400">
                            Esta é a página de unidades de medida. Aqui você pode gerenciar as unidades cadastradas no sistema.
                        </p>

                    </div>

                    <Button
                        type="button"
                        className="bg-[#4EDB4E] hover:bg-[#3CB43C] p-3 w-auto mt-2"
                        onClick={() => setShowUnitForm(true)}
                    >
                        Adicionar nova unidade de medida
                    </Button>

                </div>

                <Inputs
                    type="text"
                    placeholder="Pesquisar unidades de medida..."
                    className="mt-5 rounded-lg border bg-[#15102b] p-3 focus:border-[#4EDB4E] w-1/2"
                    icon={Search}
                />

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {units.map((unidade, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-gray-800 bg-[#0d0920] p-5"
                        >
                            <h2 className="text-xl font-bold">
                                {unidade.desc}
                            </h2>

                            <p className="mt-2 text-gray-400">
                                Gramatura: {unidade.gramatura}
                            </p>

                            <p className="mt-1 text-gray-400">
                                Fracionável: {unidade.fgFracionavel ? "Sim" : "Não"}
                            </p>

                        </div>
                    ))}
                </div>

            </main>

            {showUnitForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

                    <div className="w-full max-w-2xl rounded-xl bg-[#0d0920] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Adicionar unidade de medida
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Preencha os dados da nova unidade de medida.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowUnitForm(false)}
                                className="text-2xl text-gray-400 hover:text-white"
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

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium">
                                        Descrição
                                    </label>

                                    <input
                                        type="text"
                                        value={newUnit.desc}
                                        onChange={(e) =>
                                            setNewUnit({
                                                ...newUnit,
                                                desc: e.target.value
                                            })
                                        }
                                        placeholder="Nome da unidade de medida"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Gramatura
                                    </label>

                                    <input
                                        type="text"
                                        value={newUnit.gramatura}
                                        onChange={(e) =>
                                            setNewUnit({
                                                ...newUnit,
                                                gramatura: e.target.value
                                            })
                                        }
                                        placeholder="Ex: 500g"
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
                                        value={newUnit.unidade}
                                        onChange={(e) =>
                                            setNewUnit({
                                                ...newUnit,
                                                unidade: e.target.value
                                            })
                                        }
                                        placeholder="Ex: UN, KG, L"
                                        className="w-full rounded-lg border border-gray-700 bg-[#15102b] p-3 text-white outline-none focus:border-[#4EDB4E]"
                                        required
                                    />
                                </div>


                                <div>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg  p-3">
                                        <input
                                            type="checkbox"
                                            checked={newUnit.fgFracionavel}
                                            onChange={(e) =>
                                                setNewUnit({
                                                    ...newUnit,
                                                    fgFracionavel: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5 accent-[#4EDB4E]"
                                        />

                                        <span>
                                            {newUnit.fgFracionavel
                                                ? "Unidade fracionável"
                                                : "Unidade não fracionável"}
                                        </span>
                                    </label>
                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setShowUnitForm(false)}
                                    className="rounded-lg bg-gray-700 px-5 py-3 font-bold text-white transition hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>

                                <Button
                                    type="submit"
                                    className="mt-0 w-auto bg-[#4EDB4E] px-5 py-3 hover:bg-[#3CB43C]"
                                >
                                    Cadastrar unidade
                                </Button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>

    )
}

export default UnidadesMedida;