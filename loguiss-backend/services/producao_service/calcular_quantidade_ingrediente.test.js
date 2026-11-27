import assert from 'node:assert/strict';
import { test } from 'node:test';

import { calcular_quantidade_ingrediente } from './calcular_quantidade_ingrediente.js';

test('escala a receita e inclui a margem como matéria-prima adicional', () => {
    const necessario = calcular_quantidade_ingrediente(
        200,
        10,
        1,
        5,
        { id_unidade: 1 },
        { id_unidade: 1 },
    );

    assert.equal(necessario.toString(), '2100');
});

test('considera o rendimento cadastrado na receita', () => {
    const necessario = calcular_quantidade_ingrediente(
        4,
        5,
        2,
        5,
        { id_unidade: 1 },
        { id_unidade: 1 },
    );

    assert.equal(necessario.toString(), '10.5');
});

test('arredonda demanda fracionária para cima sem subestimar o estoque', () => {
    const necessario = calcular_quantidade_ingrediente(
        1,
        1,
        3,
        0,
        { id_unidade: 1 },
        { id_unidade: 1 },
    );

    assert.equal(necessario.toString(), '0.3333333334');
});

test('converte a necessidade para a unidade de estoque', () => {
    const necessario = calcular_quantidade_ingrediente(
        200,
        10,
        1,
        5,
        { id_unidade: 1, dimensao_conversao: 'MASSA', fator_conversao: 1, nomenclatura: 'g' },
        { id_unidade: 2, dimensao_conversao: 'MASSA', fator_conversao: 1000, nomenclatura: 'kg' },
    );

    assert.equal(necessario.toString(), '2.1');
});

test('rejeita conversão entre unidades sem dimensão compatível', () => {
    assert.throws(
        () =>
            calcular_quantidade_ingrediente(
                200,
                1,
                1,
                0,
                { id_unidade: 1, dimensao_conversao: 'MASSA', fator_conversao: 1, nomenclatura: 'g' },
                { id_unidade: 2, dimensao_conversao: 'VOLUME', fator_conversao: 1, nomenclatura: 'ml' },
            ),
        /não possuem conversão compatível/,
    );
});

test('rejeita margem acima do limite', () => {
    assert.throws(() =>
        calcular_quantidade_ingrediente(
            1,
            1,
            1,
            101,
            { id_unidade: 1 },
            { id_unidade: 1 },
        ),
        /dados da receita ou da produção são inválidos/,
    );
});
