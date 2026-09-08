/*
  Warnings:

  - You are about to drop the column `cod_verify` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `expira_em` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "cod_verify",
DROP COLUMN "expira_em",
ADD COLUMN     "email_verificado" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "verificacao_user" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expira_em" TIMESTAMP(3),
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "verificacao_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verificacao_user_token_key" ON "verificacao_user"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificacao_user_id_user_key" ON "verificacao_user"("id_user");

-- AddForeignKey
ALTER TABLE "verificacao_user" ADD CONSTRAINT "verificacao_user_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
