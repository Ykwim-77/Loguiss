-- CreateTable
CREATE TABLE "unidade_medida" (
    "id_unidade" SERIAL NOT NULL,
    "descrunidade" TEXT NOT NULL,
    "nomenclatura" TEXT NOT NULL,
    "flagativo" TEXT NOT NULL DEFAULT 'T',

    CONSTRAINT "unidade_medida_pkey" PRIMARY KEY ("id_unidade")
);
