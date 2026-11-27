import { Prisma } from '@prisma/client';

const dimensoesPermitidas = new Set(['MASSA', 'VOLUME', 'CONTAGEM']);

export function validar_conversao_unidade(dimensao, fator) {
    const dimensaoNormalizada =
        dimensao === null || dimensao === undefined ? '' : String(dimensao).trim().toUpperCase();
    const dimensaoInformada = dimensaoNormalizada !== '';
    const fatorInformado = fator !== null && fator !== undefined && String(fator).trim() !== '';

    if (!dimensaoInformada && !fatorInformado) {
        return {
            dados: {
                dimensao_conversao: null,
                fator_conversao: null,
            },
        };
    }

    if (
        !dimensaoInformada ||
        !fatorInformado ||
        !dimensoesPermitidas.has(dimensaoNormalizada)
    ) {
        return {
            erro: 'Informe uma dimensão válida e seu fator de conversão para a unidade-base.',
        };
    }

    let fatorDecimal;
    try {
        fatorDecimal = new Prisma.Decimal(fator);
    } catch {
        return { erro: 'O fator de conversão deve ser um número maior que zero.' };
    }

    if (!fatorDecimal.isFinite() || !fatorDecimal.gt(0)) {
        return { erro: 'O fator de conversão deve ser um número maior que zero.' };
    }

    return {
        dados: {
            dimensao_conversao: dimensaoNormalizada,
            fator_conversao: fatorDecimal,
        },
    };
}
