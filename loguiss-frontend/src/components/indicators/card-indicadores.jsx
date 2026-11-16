
import { Card } from '../card';
import { Package, DollarSign } from 'lucide-react';

export function CardsIndicadores({ produtos }) {
    const valorTotalEstoque = produtos.reduce(
        (total, produto) =>
            total + produto.estoqueAtual * produto.valorUnitario,
        0
    );

    return (
        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card
                desc="Total de produtos cadastrados"
                icon={<Package size={24} className="text-[#A3E635]" />}
                showActions={false}
            >
                <div className="mt-5">
                    <p className="text-3xl font-bold text-[#F5F5F5]">
                        {produtos.length}
                    </p>
                </div>
            </Card>
            <Card
                desc="Valor total do estoque"
                icon={<DollarSign size={24} className="text-[#A3E635]" />}
                showActions={false}
            >
                <div className="mt-5">
                    <p className="text-3xl font-bold text-[#F5F5F5]">
                        {valorTotalEstoque.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}
                    </p>
                </div>
            </Card>
        </div>
    );
}
