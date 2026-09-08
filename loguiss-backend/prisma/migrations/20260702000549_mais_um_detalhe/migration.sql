/*
  Warnings:

  - You are about to drop the column `token` on the `verificacao_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "verificacao_user" DROP COLUMN "token",
ADD COLUMN     "cod_verify" TEXT;
