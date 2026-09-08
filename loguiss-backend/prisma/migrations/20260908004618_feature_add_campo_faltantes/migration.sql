-- AlterTable
ALTER TABLE "produto" ADD COLUMN     "dt_entrada" TIMESTAMP(3),
ADD COLUMN     "minimo" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "prazo_saida" TIMESTAMP(3);
