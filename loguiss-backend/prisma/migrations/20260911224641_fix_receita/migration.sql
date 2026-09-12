-- AlterTable
ALTER TABLE "receita" ADD COLUMN     "margem_perda" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "quantidade_perdida" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "quantidade_produzida" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tipo_produto" ADD COLUMN     "flag_tipo" TEXT;
