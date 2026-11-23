import { SideBar } from '../components/sidebar';
import { Card} from '../components/card';
import { Inputs} from '../components/inputs';
import { CreditCard, BriefcaseBusiness } from 'lucide-react';

function ConfiguracoesIA() {

    return (
        <div className="min-h-screen bg-[#111111] text-[#F5F5F5]">
            <SideBar />
            <main className="ml-72 min-h-screen p-5">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Configurações de IA
                        </h1>
                        <p className="text-gray-400">
                            Esta é a página de configurações de IA. Aqui você pode gerenciar todas as configurações e informações da IA que auxilia nas previsões.
                        </p>
                    </div>

                    <div className="mt-5 h-[380px] w-full rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">
                        <div className='items-center gap-5 flex'>
                            <BriefcaseBusiness></BriefcaseBusiness>
                            <h2 className="text-xl font-bold text-[#F5F5F5]">
                                Informações da empresa
                            </h2>
                        </div>
                        <p className='mt-1 text-sm text-[#A3A3A3]'>
                            Dados que identificam sua empresa no sistema e nos documentos gerados.
                        </p>
                    </div>
                    <div className="mt-5 h-[380px] w-full rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">
                        <div className='items-center gap-5 flex'>
                            <CreditCard></CreditCard>
                            <h2 className="text-xl font-bold text-[#F5F5F5]">
                                Situação do plano
                            </h2>
                        </div>
                        <p className='mt-1 text-sm text-[#A3A3A3]'>
                            Acompanhe o período de avaliação da sua conta e o que acontece quando ele termina.
                        </p>
                    </div>
            </main>
        </div>
    )
}

export default ConfiguracoesIA;