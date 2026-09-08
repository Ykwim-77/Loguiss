/*
  Warnings:

  - Added the required column `valor` to the `produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "produto" ADD COLUMN     "is_fracionado" TEXT NOT NULL DEFAULT 'F',
ADD COLUMN     "valor" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "unidade_medida" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "flag_ativo" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;
