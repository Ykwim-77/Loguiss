import { StatCard } from '../card';
import { Package, DollarSign } from 'lucide-react';
import { formatarMoeda } from '../../utils/validacoes';

export function CardsIndicadores({ produtos }) {
    const valorTotalEstoque = produtos.reduce(
        (total, produto) => total + produto.estoqueAtual * produto.valorUnitario,
        0
    );

    return (
        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <StatCard titulo="Total de produtos cadastrados" valor={produtos.length} icone={Package} />
            <StatCard titulo="Valor total do estoque" valor={formatarMoeda(valorTotalEstoque)} icone={DollarSign} />
        </div>
    );
}