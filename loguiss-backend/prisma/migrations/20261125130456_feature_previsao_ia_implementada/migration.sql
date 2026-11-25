-- AlterTable
ALTER TABLE "empresa" ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "segmento" TEXT,
ADD COLUMN     "uf" TEXT;

-- CreateTable
CREATE TABLE "configuracao_ia" (
    "id_configuracao_ia" SERIAL NOT NULL,
    "horizonte_dias" INTEGER NOT NULL DEFAULT 14,
    "intervalo_minutos" INTEGER NOT NULL DEFAULT 1440,
    "agendamento_ativo" BOOLEAN NOT NULL DEFAULT false,
    "prazo_reposicao_padrao_dias" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracao_ia_pkey" PRIMARY KEY ("id_configuracao_ia")
);

-- CreateTable
CREATE TABLE "previsao" (
    "id_previsao" SERIAL NOT NULL,
    "horizonte_dias" INTEGER NOT NULL,
    "modelo" TEXT NOT NULL,
    "localizacao" TEXT,
    "segmento" TEXT,
    "contexto" JSONB,
    "dados_enviados" JSONB,
    "resposta_bruta" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "previsao_pkey" PRIMARY KEY ("id_previsao")
);

-- CreateTable
CREATE TABLE "previsao_produto" (
    "id_previsao_produto" SERIAL NOT NULL,
    "id_previsao" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "estoque_na_data" DOUBLE PRECISION NOT NULL,
    "estoque_seguro" DOUBLE PRECISION NOT NULL,
    "prazo_reposicao_dias" INTEGER NOT NULL,
    "media_dia" DOUBLE PRECISION NOT NULL,
    "total_previsto" DOUBLE PRECISION NOT NULL,
    "confianca" DOUBLE PRECISION,
    "justificativa" TEXT,
    "cobertura_dias" DOUBLE PRECISION,
    "dias_para_comprar" INTEGER,
    "urgente" BOOLEAN NOT NULL,
    "comprar_qtd" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "previsao_produto_pkey" PRIMARY KEY ("id_previsao_produto")
);

-- CreateTable
CREATE TABLE "previsao_periodo" (
    "id_previsao_periodo" SERIAL NOT NULL,
    "id_previsao_produto" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "previsao_periodo_pkey" PRIMARY KEY ("id_previsao_periodo")
);

-- CreateTable
CREATE TABLE "alerta" (
    "id_alerta" SERIAL NOT NULL,
    "id_previsao" INTEGER,
    "id_produto" INTEGER NOT NULL,
    "severidade" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "lido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerta_pkey" PRIMARY KEY ("id_alerta")
);

-- CreateIndex
CREATE INDEX "previsao_created_at_idx" ON "previsao"("created_at");

-- CreateIndex
CREATE INDEX "previsao_produto_id_produto_idx" ON "previsao_produto"("id_produto");

-- CreateIndex
CREATE UNIQUE INDEX "previsao_produto_id_previsao_id_produto_key" ON "previsao_produto"("id_previsao", "id_produto");

-- CreateIndex
CREATE UNIQUE INDEX "previsao_periodo_id_previsao_produto_data_key" ON "previsao_periodo"("id_previsao_produto", "data");

-- CreateIndex
CREATE INDEX "alerta_created_at_idx" ON "alerta"("created_at");

-- AddForeignKey
ALTER TABLE "previsao_produto" ADD CONSTRAINT "previsao_produto_id_previsao_fkey" FOREIGN KEY ("id_previsao") REFERENCES "previsao"("id_previsao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "previsao_produto" ADD CONSTRAINT "previsao_produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "previsao_periodo" ADD CONSTRAINT "previsao_periodo_id_previsao_produto_fkey" FOREIGN KEY ("id_previsao_produto") REFERENCES "previsao_produto"("id_previsao_produto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerta" ADD CONSTRAINT "alerta_id_previsao_fkey" FOREIGN KEY ("id_previsao") REFERENCES "previsao"("id_previsao") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerta" ADD CONSTRAINT "alerta_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;
