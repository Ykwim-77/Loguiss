CREATE TABLE "producao" (
    "id_producao" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "descricao_receita" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "rendimento_receita" DECIMAL(65,30) NOT NULL,
    "margem_perda" DECIMAL(65,30) NOT NULL,
    "chave_idempotencia" TEXT NOT NULL,
    "data_producao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "producao_pkey" PRIMARY KEY ("id_producao")
);

ALTER TABLE "movimentacao_estoque"
ADD COLUMN "id_producao" INTEGER;

CREATE UNIQUE INDEX "producao_chave_idempotencia_key"
ON "producao"("chave_idempotencia");

CREATE INDEX "producao_id_produto_idx"
ON "producao"("id_produto");

CREATE INDEX "producao_data_producao_idx"
ON "producao"("data_producao");

CREATE UNIQUE INDEX "movimentacao_estoque_id_producao_id_produto_tipo_key"
ON "movimentacao_estoque"("id_producao", "id_produto", "tipo");

ALTER TABLE "producao"
ADD CONSTRAINT "producao_id_produto_fkey"
FOREIGN KEY ("id_produto")
REFERENCES "produto"("id_produto")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "movimentacao_estoque"
ADD CONSTRAINT "movimentacao_estoque_id_producao_fkey"
FOREIGN KEY ("id_producao")
REFERENCES "producao"("id_producao")
ON DELETE SET NULL
ON UPDATE CASCADE;
