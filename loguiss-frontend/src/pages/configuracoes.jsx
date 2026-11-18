import { SideBar } from '../components/sidebar';

function Configuracoes() {

    return (
        <div className="min-h-screen bg-[#111111] text-[#F5F5F5]">
            <SideBar />
            <main className="ml-72 min-h-screen p-5">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Configurações
                        </h1>
                        <p className="text-gray-400">
                            Esta é a página de configurações. Aqui você pode gerenciar todas as configurações e personalizações do sistema.
                        </p>
                    </div>

                    <div className="mt-5 h-[380px] w-full rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">
                        <h2 className="text-xl font-bold text-[#F5F5F5]">
                            Configurações da empresa
                        </h2>
                    </div>
            </main>
        </div>
    )
}

export default Configuracoes;