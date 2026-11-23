import { SideBar } from '../components/sidebar';
import { Card} from '../components/card';
import { Inputs} from '../components/inputs';
import { CreditCard, BriefcaseBusiness } from 'lucide-react';

function PrevisaoDemanda() {

    return (
        <div className="min-h-screen bg-[#111111] text-[#F5F5F5]">
            <SideBar />
            <main className="ml-72 min-h-screen p-5">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 mt-2">
                            Previsão de Demandas
                        </h1>
                        <p className="text-gray-400">
                            Esta é a página de previsão de demandas. Aqui você pode analisar todas as previsões geradas automaticamente pelo sistema.
                        </p>
                    </div>
            </main>
        </div>
    )
}

export default PrevisaoDemanda;