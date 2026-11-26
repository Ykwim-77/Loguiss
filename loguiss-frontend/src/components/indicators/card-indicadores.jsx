import { DollarSign, Package } from 'lucide-react';

import { formatarMoeda } from '../../utils/validacoes';
import { StatCard } from '../card';

export function CardsIndicadores({ produtos }) {
    const valorTotalEstoque = produtos.reduce(
        (total, produto) => total + produto.estoqueAtual * produto.valorUnitario,
        0,
    );

    return (
        <div className="mb-0 grid grid-cols-1 gap-5 md:grid-cols-2">
            <StatCard
                titulo="Total de produtos cadastrados"
                valor={produtos.length}
                icone={Package}
            />
            <StatCard
                titulo="Valor total do estoque"
                valor={formatarMoeda(valorTotalEstoque)}
                icone={DollarSign}
            />
        </div>
    );
}
