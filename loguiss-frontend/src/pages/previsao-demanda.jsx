import { CalendarClock, ChartColumn, Package, TriangleAlert } from 'lucide-react';

import { StatCard } from '../components/card';
import { AlertasIA } from '../components/indicators/alertas-ia';
import { HistoricoMovimentacoes } from '../components/indicators/historico-movimentacoes';
import { PrevisaoDemandasIA } from '../components/indicators/previsao-demandas-ia';
import { PrevisaoSaida } from '../components/indicators/previsao-venda';
import { RecomendacoesCompra } from '../components/indicators/recomendacao-compra';
import { SideBar } from '../components/sidebar';

function PrevisaoDemanda() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />
            <main className="ml-72 min-h-screen p-5">
                <div>
                    <h1 className="text-3xl font-bold mb-2 mt-2">Previsão de Demandas</h1>
                    <p className="text-gray-400">
                        Esta é a página de previsão de demandas. Aqui você pode analisar todas as
                        previsões geradas automaticamente pelo sistema.
                    </p>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-3">
                    <StatCard
                        titulo="Produtos Monitorados"
                        valor="5"
                        icone={Package}
                        subDescricao="Produtos incluídos na amostra"
                        tituloClassName="text-sm"
                    />
                    <StatCard
                        titulo="Produtos em risco"
                        valor="3"
                        icone={TriangleAlert}
                        subDescricao="Produtos com baixo estoque"
                    />
                    <StatCard
                        titulo="Reposição"
                        valor="2"
                        descricao="dias"
                        icone={CalendarClock}
                        subDescricao="Data da próxima reposição"
                    />
                    <StatCard
                        titulo="Alertas"
                        valor="5"
                        icone={ChartColumn}
                        subDescricao="Estimativas que pedem atenção"
                    />
                </div>
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 mb-3">
                    <PrevisaoDemandasIA
                        titulo="Projeção de estoque"
                        descricao="Saldo estimado a partir do consumo médio diário"
                    />
                    <PrevisaoSaida />
                </div>
                <RecomendacoesCompra />
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 mt-1">
                    <HistoricoMovimentacoes />
                    <AlertasIA />
                </div>
            </main>
        </div>
    );
}

export default PrevisaoDemanda;
