import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validar_conversao_unidade } from './validar_conversao_unidade.js';

test('allows legacy units without conversion metadata', () => {
    assert.deepEqual(validar_conversao_unidade('', ''), {
        dados: {
            dimensao_conversao: null,
            fator_conversao: null,
        },
    });
});

test('requires a valid dimension and positive conversion factor together', () => {
    assert.match(validar_conversao_unidade('MASSA', '').erro, /dimensão válida/);
    assert.match(validar_conversao_unidade('OUTRA', '1').erro, /dimensão válida/);
    assert.match(validar_conversao_unidade('MASSA', '0').erro, /maior que zero/);
});

test('keeps decimal conversion factors precise', () => {
    const resultado = validar_conversao_unidade('MASSA', '0.001');

    assert.equal(resultado.dados.fator_conversao.toString(), '0.001');
});
