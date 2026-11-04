import { useEffect, useState } from 'react';

import { SideBar } from '../components/Sidebar';

import { Movimentacoes } from '../components/indicators/movimentacoes';
import { AlertaEstoque } from '../components/indicators/alerta-estoque';
import { CardsIndicadores } from '../components/indicators/card-indicadores';
import { DistribuicaoCategoria } from '../components/indicators/distribuicao-categoria';
import { ProdutosParados } from '../components/indicators/produtos-parados';
import { EvolucaoVendas } from '../components/indicators/evolucao-vendas';

import api from '../services/api';
import { adaptarProdutosDashboard } from '../utils/dashboardUtils';

function Dashboard() {

    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const response = await api.get('/produto/list_produtos');

                const produtosAdaptados = adaptarProdutosDashboard(
                    response.data.produtos
                );

                setProdutos(produtosAdaptados);

            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        buscarProdutos();
    }, []);

    return (
        <div className="min-h-screen bg-[#050212] text-white">
            <SideBar />
            <main className="ml-72 min-h-screen p-5">
                <div className="mb-5">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-400">
                        Visualize as métricas e os indicadores do sistema.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-1  ">
                    <CardsIndicadores produtos={produtos} />
                    <AlertaEstoque produtos={produtos} />
                    <Movimentacoes />
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <DistribuicaoCategoria />
                        <ProdutosParados produtos={produtos} />
                    </div>
                    <EvolucaoVendas />
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
