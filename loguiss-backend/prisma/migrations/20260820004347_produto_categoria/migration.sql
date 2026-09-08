-- CreateTable
CREATE TABLE "Categoria" (
    "idCategoria" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "flagAtivo" TEXT NOT NULL DEFAULT 'T',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("idCategoria")
);

-- CreateTable
CREATE TABLE "ProdutoCategoria" (
    "idProdutoCategoria" SERIAL NOT NULL,
    "idCategoria" INTEGER NOT NULL,
    "idProduto" INTEGER NOT NULL,

    CONSTRAINT "ProdutoCategoria_pkey" PRIMARY KEY ("idProdutoCategoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProdutoCategoria_idProduto_idCategoria_key" ON "ProdutoCategoria"("idProduto", "idCategoria");

-- AddForeignKey
ALTER TABLE "ProdutoCategoria" ADD CONSTRAINT "ProdutoCategoria_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "Categoria"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;
