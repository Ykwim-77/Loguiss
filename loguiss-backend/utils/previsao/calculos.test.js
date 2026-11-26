import assert from 'node:assert/strict';
import { test } from 'node:test';

import calc from './calculos.js';

test('preverLocalmente gera a série completa e preserva quantidades inteiras', () => {
  const entradas = [
    {
      id_produto: 7,
      fracionado: false,
      estatisticas: {
        media_dia_7: 2,
        media_dia_30: 2,
        tendencia_percentual: 0,
        dias_com_saida: 30,
      },
      historico_saidas: {
        data_inicial: '2026-10-28',
        quantidades_por_dia: Array(30).fill(2),
      },
    },
  ];
  const datas = ['2026-11-27', '2026-11-28', '2026-11-29'];

  const previsoes = calc.preverLocalmente(entradas, datas);
  const previsao = previsoes.get(7);

  assert.equal(previsoes.size, 1);
  assert.deepEqual(
    previsao.serie.map(({ data }) => data),
    datas
  );
  assert.deepEqual(
    previsao.serie.map(({ quantidade }) => quantidade),
    [2, 2, 2]
  );
  assert.ok(previsao.serie.every(({ quantidade }) => Number.isInteger(quantidade)));
  assert.match(previsao.justificativa, /IA indisponível/);
});

test('preverLocalmente retorna zero quando não há saídas no histórico', () => {
  const previsoes = calc.preverLocalmente(
    [
      {
        id_produto: 8,
        fracionado: true,
        estatisticas: { media_dia_7: 0, media_dia_30: 0, dias_com_saida: 0 },
        historico_saidas: {
          data_inicial: '2026-10-28',
          quantidades_por_dia: Array(30).fill(0),
        },
      },
    ],
    ['2026-11-27']
  );

  assert.equal(previsoes.get(8).serie[0].quantidade, 0);
});

test('previsaoCompleta rejeita horizonte que não tem todos os períodos por produto', () => {
  assert.equal(
    calc.previsaoCompleta({
      horizonte_dias: 5,
      produtos: [{ periodos: [{ data: '2026-11-27', quantidade: 1 }] }],
    }),
    false
  );
});

test('previsaoCompleta exige que todos os produtos cubram o horizonte', () => {
  assert.equal(
    calc.previsaoCompleta({
      horizonte_dias: 2,
      produtos: [
        { periodos: [{ data: '2026-11-27' }, { data: '2026-11-28' }] },
        { periodos: [{ data: '2026-11-27' }] },
      ],
    }),
    false
  );
  assert.equal(
    calc.previsaoCompleta({
      horizonte_dias: 2,
      produtos: [
        { periodos: [{ data: '2026-11-27' }, { data: '2026-11-28' }] },
        { periodos: [{ data: '2026-11-27' }, { data: '2026-11-28' }] },
      ],
    }),
    true
  );
});

test('ordenarProdutosPorVendas prioriza saídas e ignora movimentações de entrada', () => {
  const ordenados = calc.ordenarProdutosPorVendas(
    [1, 2, 3],
    [
      { id_produto: 1, tipo: 'saida', _sum: { quantidade: 8 } },
      { id_produto: 1, tipo: 'entrada', _sum: { quantidade: 100 } },
      { id_produto: 2, tipo: 'venda', _sum: { quantidade: 12 } },
    ]
  );

  assert.deepEqual(ordenados, [2, 1, 3]);
});
