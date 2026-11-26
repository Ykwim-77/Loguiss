import assert from 'node:assert/strict';
import { test } from 'node:test';

import { montarVisao } from './formatador.js';

test('montarVisao expõe os dados persistidos de todos os produtos e respostas IA', () => {
  const previsao = {
    id_previsao: 12,
    horizonte_dias: 1,
    created_at: new Date('2026-11-26T12:00:00Z'),
    modelo: 'gemini-3.5-flash-lite',
    localizacao: 'Dois Vizinhos, PR',
    segmento: 'Food Truck',
    contexto: { sazonalidade: 'Confraternizações' },
    resposta_bruta: { lotes: [{ produtos: [{ id_produto: 4 }] }] },
    alertas: [],
    produtos: [
      {
        id_produto: 4,
        estoque_na_data: 8,
        estoque_seguro: 3,
        prazo_reposicao_dias: 2,
        media_dia: 1.5,
        total_previsto: 1.5,
        confianca: 0.8,
        justificativa: 'Consumo regular.',
        cobertura_dias: 5.3,
        dias_para_comprar: 3,
        urgente: false,
        comprar_qtd: 0,
        produto: {
          descricao: 'Produto teste',
          unidade_medida: { nomenclatura: 'UN' },
          tipo_produto: null,
          categorias: [],
        },
        periodos: [{ data: new Date('2026-11-27T00:00:00Z'), quantidade: 1.5 }],
      },
    ],
  };

  const visao = montarVisao(previsao);

  assert.equal(visao.produtosPrevisao.length, 1);
  assert.deepEqual(visao.produtosPrevisao[0].serie, [
    { data: '2026-11-27', quantidade: 1.5 },
  ]);
  assert.equal(visao.produtosPrevisao[0].confianca, 0.8);
  assert.equal(visao.produtosPrevisao[0].justificativa, 'Consumo regular.');
  assert.deepEqual(visao.respostasIA, [{ produtos: [{ id_produto: 4 }] }]);
  assert.deepEqual(visao.recomendacoesCompra, []);
});
