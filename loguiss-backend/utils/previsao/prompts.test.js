import assert from 'node:assert/strict';
import { test } from 'node:test';

import { montarMensagemPrevisao } from './prompts.js';

test('montarMensagemPrevisao envia no máximo 40 movimentações dos produtos selecionados', () => {
  const produtos = Array.from({ length: 3 }, (_, indice) => ({
    id_produto: indice + 1,
    nome: `Produto ${indice + 1}`,
    categoria: 'Categoria',
    unidade: 'UN',
    fracionado: false,
    estoque_atual: 10,
    estoque_seguro: 2,
    prazo_reposicao_dias: 3,
    estatisticas: {
      media_dia_7: 1,
      media_dia_30: 1,
      tendencia_percentual: 0,
      dias_com_saida: 7,
    },
    historico_saidas: {
      data_inicial: '2026-11-13',
      quantidades_por_dia: Array(14).fill(1),
    },
    movimentacoes_recentes: Array.from({ length: 25 }, (_, movimento) => ({
      data: '2026-11-25',
      tipo: 'saida',
      quantidade: movimento + 1,
    })),
  }));

  const mensagem = montarMensagemPrevisao({
    dataReferencia: '2026-11-26',
    dataInicioPrevisao: '2026-11-27',
    dataFimPrevisao: '2026-11-28',
    horizonteDias: 2,
    contexto: { eventos: [], sazonalidade: '' },
    produtos,
  });
  const produtosEnviados = JSON.parse(mensagem).produtos;
  const movimentosEnviados = produtosEnviados.flatMap((produto) => produto.mov);

  assert.equal(produtosEnviados.length, 3);
  assert.equal(movimentosEnviados.length, 40);
  assert.ok(movimentosEnviados.every((movimento) => movimento.tipo === 'saida'));
});
