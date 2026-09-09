/*
  Warnings:

  - You are about to drop the column `dt_entrada` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `is_fracionado` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `minimo` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `prazo_saida` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "produto" DROP COLUMN "dt_entrada",
DROP COLUMN "is_fracionado",
DROP COLUMN "minimo",
DROP COLUMN "prazo_saida",
DROP COLUMN "quantidade";

-- CreateTable
CREATE TABLE "estoque" (
    "id_estoque" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "minimo" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "is_fracionado" TEXT NOT NULL DEFAULT 'F',
    "dt_entrada" TIMESTAMP(3),
    "prazo_saida" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estoque_pkey" PRIMARY KEY ("id_estoque")
);

-- CreateIndex
CREATE UNIQUE INDEX "estoque_id_produto_key" ON "estoque"("id_produto");

-- AddForeignKey
ALTER TABLE "estoque" ADD CONSTRAINT "estoque_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id_produto") ON DELETE CASCADE ON UPDATE CASCADE;
