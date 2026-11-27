import { Prisma } from '@prisma/client';

export function calcular_quantidade_ingrediente(
    quantidadeIngrediente,
    quantidadeProduzida,
    rendimentoReceita,
    margemPerdaPercentual,
    unidadeReceita,
    unidadeEstoque,
) {
    const quantidadeBase = new Prisma.Decimal(quantidadeIngrediente);
    const quantidadeAlvo = new Prisma.Decimal(quantidadeProduzida);
    const rendimentoBase = new Prisma.Decimal(rendimentoReceita);
    const margem = new Prisma.Decimal(margemPerdaPercentual);

    if (
        !quantidadeBase.isFinite() ||
        quantidadeBase.isNegative() ||
        !quantidadeAlvo.isFinite() ||
        !quantidadeAlvo.gt(0) ||
        !rendimentoBase.isFinite() ||
        !rendimentoBase.gt(0) ||
        !margem.isFinite() ||
        margem.isNegative() ||
        margem.gt(100)
    ) {
        throw new TypeError('Os dados da receita ou da produção são inválidos.');
    }

    let quantidadeNecessaria = quantidadeBase
        .mul(quantidadeAlvo)
        .div(rendimentoBase)
        .mul(new Prisma.Decimal(1).plus(margem.div(100)));

    if (unidadeReceita.id_unidade !== unidadeEstoque.id_unidade) {
        const fatorReceita = unidadeReceita.fator_conversao
            ? new Prisma.Decimal(unidadeReceita.fator_conversao)
            : null;
        const fatorEstoque = unidadeEstoque.fator_conversao
            ? new Prisma.Decimal(unidadeEstoque.fator_conversao)
            : null;

        if (
            !unidadeReceita.dimensao_conversao ||
            unidadeReceita.dimensao_conversao !== unidadeEstoque.dimensao_conversao ||
            !fatorReceita?.isFinite() ||
            !fatorReceita.gt(0) ||
            !fatorEstoque?.isFinite() ||
            !fatorEstoque.gt(0)
        ) {
            throw new TypeError(
                `As unidades "${unidadeReceita.nomenclatura}" e "${unidadeEstoque.nomenclatura}" não possuem conversão compatível.`,
            );
        }

        quantidadeNecessaria = quantidadeNecessaria.mul(fatorReceita).div(fatorEstoque);
    }

    return quantidadeNecessaria.toDecimalPlaces(10, Prisma.Decimal.ROUND_CEIL);
}
