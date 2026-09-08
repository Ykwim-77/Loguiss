/*
  Warnings:

  - The primary key for the `verificacao_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `verificacao_user` table. All the data in the column will be lost.
  - The required column `id_verificacao` was added to the `verificacao_user` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "verificacao_user_token_key";

-- AlterTable
ALTER TABLE "verificacao_user" DROP CONSTRAINT "verificacao_user_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_verificacao" TEXT NOT NULL,
ALTER COLUMN "token" DROP NOT NULL,
ADD CONSTRAINT "verificacao_user_pkey" PRIMARY KEY ("id_verificacao");
