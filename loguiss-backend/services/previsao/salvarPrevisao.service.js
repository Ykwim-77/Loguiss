import { prisma } from '../../database.js';

function numeroSeguro(valor, fallback = 0) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : fallback;
}

function numeroOpcional(valor) {
  if (valor === null || valor === undefined) return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

/** Salva a previsão, os produtos, a série diária e os alertas numa transação só. Devolve o id. */
export async function salvarPrevisao({
  horizonteDias,
  modelo,
  localizacao,
  segmento,
  contexto,
  contextoBruto,
  dadosEnviados,
  respostasBrutas,
  linhas = [],
  alertas = [],
}) {
  try {
    return await prisma.$transaction(
      async (tx) => {
        const criada = await tx.previsao.create({
          data: {
            horizonte_dias: numeroSeguro(horizonteDias, 14),
            modelo: modelo ?? 'desconhecido',
            localizacao: localizacao ?? null,
            segmento: segmento ?? null,
            contexto: contexto ?? null,
            dados_enviados: { lotes: dadosEnviados },
            resposta_bruta: { contexto: contextoBruto, lotes: respostasBrutas },
          },
        });

        if (linhas.length > 0) {
          await tx.previsao_produto.createMany({
            data: linhas.map(({ entrada, previsao, recomendacao }) => ({
              id_previsao: criada.id_previsao,
              id_produto: numeroSeguro(entrada.id_produto),
              estoque_na_data: numeroSeguro(entrada.estoque_atual, 0),
              estoque_seguro: numeroSeguro(entrada.estoque_seguro, 0),
              prazo_reposicao_dias: numeroSeguro(entrada.prazo_reposicao_dias, 3),
              media_dia: numeroSeguro(recomendacao?.media_dia, 0),
              total_previsto: numeroSeguro(recomendacao?.total_previsto, 0),
              confianca: numeroOpcional(previsao?.confianca),
              justificativa: previsao?.justificativa ?? null,
              cobertura_dias: numeroOpcional(recomendacao?.cobertura_dias),
              dias_para_comprar:
                recomendacao?.dias_para_comprar === null || recomendacao?.dias_para_comprar === undefined
                  ? null
                  : numeroSeguro(recomendacao.dias_para_comprar),
              urgente: Boolean(recomendacao?.urgente),
              comprar_qtd: numeroSeguro(recomendacao?.comprar_qtd, 0),
            })),
          });

          const criadosProdutos = await tx.previsao_produto.findMany({
            where: { id_previsao: criada.id_previsao },
            select: { id_previsao_produto: true, id_produto: true },
          });

          const mapaIdPrevProd = new Map(
            criadosProdutos.map((item) => [item.id_produto, item.id_previsao_produto])
          );

          const periodosParaInserir = [];
          for (const { entrada, previsao } of linhas) {
            const idPrevProd = mapaIdPrevProd.get(numeroSeguro(entrada.id_produto));
            if (!idPrevProd) continue;
            const serie = Array.isArray(previsao?.serie) ? previsao.serie : [];
            for (const dia of serie) {
              periodosParaInserir.push({
                id_previsao_produto: idPrevProd,
                data: new Date(`${dia.data}T00:00:00Z`),
                quantidade: numeroSeguro(dia.quantidade, 0),
              });
            }
          }

          if (periodosParaInserir.length > 0) {
            await tx.previsao_periodo.createMany({
              data: periodosParaInserir,
            });
          }
        }

        if (Array.isArray(alertas) && alertas.length > 0) {
          await tx.alerta.createMany({
            data: alertas.map((a) => ({
              id_previsao: criada.id_previsao,
              id_produto: numeroSeguro(a.id_produto),
              severidade: a.severidade,
              titulo: a.titulo,
              descricao: a.descricao,
              lido: Boolean(a.lido),
            })),
          });
        }

        return criada.id_previsao;
      },
      { maxWait: 10000, timeout: 60000 }
    );
  } catch (erro) {
    console.error('[salvarPrevisao] erro ao salvar no banco:', erro);
    throw erro;
  }
}

export default { salvarPrevisao };