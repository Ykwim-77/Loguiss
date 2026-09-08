/*
  Warnings:

  - You are about to drop the column `flagativo` on the `unidade_medida` table. All the data in the column will be lost.
  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProdutoCategoria` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `unidade_medida` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProdutoCategoria" DROP CONSTRAINT "ProdutoCategoria_idCategoria_fkey";

-- AlterTable
ALTER TABLE "unidade_medida" DROP COLUMN "flagativo",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "flag_ativo" TEXT NOT NULL DEFAULT 'T',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Categoria";

-- DropTable
DROP TABLE "ProdutoCategoria";

-- CreateTable
CREATE TABLE "categoria" (
    "id_categoria" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "flag_ativo" TEXT NOT NULL DEFAULT 'T',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "produto_categoria" (
    "id_produto_categoria" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,

    CONSTRAINT "produto_categoria_pkey" PRIMARY KEY ("id_produto_categoria")
);

-- CreateTable
CREATE TABLE "tipo_produto" (
    "id_tipo_produto" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "flag_ativo" TEXT NOT NULL DEFAULT 'T',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipo_produto_pkey" PRIMARY KEY ("id_tipo_produto")
);

-- CreateTable
CREATE TABLE "produto" (
    "id_produto" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "id_tipo_produto" INTEGER NOT NULL,
    "id_unidade_medida" INTEGER NOT NULL,
    "flag_ativo" TEXT NOT NULL DEFAULT 'T',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id_produto")
);

-- CreateTable
CREATE TABLE "receita" (
    "id_receita" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "flag_ativo" TEXT NOT NULL DEFAULT 'T',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receita_pkey" PRIMARY KEY ("id_receita")
);

-- CreateTable
CREATE TABLE "receita_produto" (
    "id_receita_produto" SERIAL NOT NULL,
    "id_receita" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "id_unidade" INTEGER NOT NULL,

    CONSTRAINT "receita_produto_pkey" PRIMARY KEY ("id_receita_produto")
);

-- CreateTable
CREATE TABLE "movimentacao_estoque" (
    "id_movimentacao" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "saldo_final" DECIMAL(65,30) NOT NULL,
    "data_movimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT,

    CONSTRAINT "movimentacao_estoque_pkey" PRIMARY KEY ("id_movimentacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "produto_categoria_id_produto_id_categoria_key" ON "produto_categoria"("id_produto", "id_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "receita_produto_id_receita_id_produto_key" ON "receita_produto"("id_receita", "id_produto");

-- CreateIndex
CREATE INDEX "movimentacao_estoque_id_produto_idx" ON "movimentacao_estoque"("id_produto");

-- CreateIndex
CREATE INDEX "movimentacao_estoque_data_movimento_idx" ON "movimentacao_estoque"("data_movimento");

-- AddForeignKey
ALTER TABLE "produto_categoria" ADD CONSTRAINT "produto_categoria_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_categoria" ADD CONSTRAINT "produto_categoria_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_id_tipo_produto_fkey" FOREIGN KEY ("id_tipo_produto") REFERENCES "tipo_produto"("id_tipo_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_id_unidade_medida_fkey" FOREIGN KEY ("id_unidade_medida") REFERENCES "unidade_medida"("id_unidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita_produto" ADD CONSTRAINT "receita_produto_id_receita_fkey" FOREIGN KEY ("id_receita") REFERENCES "receita"("id_receita") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita_produto" ADD CONSTRAINT "receita_produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita_produto" ADD CONSTRAINT "receita_produto_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "unidade_medida"("id_unidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacao_estoque" ADD CONSTRAINT "movimentacao_estoque_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;
