import { SideBar } from '../components/sidebar';

function Home() {

    return (
        <div className="min-h-screen bg-[#050212] text-white">

            <SideBar />

            <main className="ml-72 min-h-screen p-8">

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8">

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
