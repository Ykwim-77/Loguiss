import { LayoutDashboard, Folder, Shuffle, Brain, Cog } from 'lucide-react';
import { SideBar } from '../components/sidebar';

function Home() {

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
                { label: "Produtos", href: "/produtos" },
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

    return (
        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar menuItems={menuItems} />

            <main className="ml-72 min-h-screen p-8">

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

                    <p className="mb-2 text-sm text-violet-300">
                        Bem-vindo ao Loguiss
                    </p>

                    <h2 className="text-3xl font-bold">Dashboard</h2>

                </div>

            </main>

        </div>

    )
}

export default Home;