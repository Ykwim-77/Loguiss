-- CreateTable
CREATE TABLE "endereco" (
    "id_endereco" SERIAL NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateTable
CREATE TABLE "fornecedor" (
    "id_fornecedor" SERIAL NOT NULL,
    "cnpj" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "id_endereco" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "fornecedor_pkey" PRIMARY KEY ("id_fornecedor")
);

-- CreateTable
CREATE TABLE "fornecedor_produto" (
    "id_fornecedor_produto" SERIAL NOT NULL,
    "id_fornecedor" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "fornecedor_produto_pkey" PRIMARY KEY ("id_fornecedor_produto")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "id_endereco" INTEGER,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateIndex
CREATE UNIQUE INDEX "fornecedor_cnpj_key" ON "fornecedor"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "fornecedor_produto_id_fornecedor_id_produto_key" ON "fornecedor_produto"("id_fornecedor", "id_produto");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_cpf_key" ON "cliente"("cpf");

-- AddForeignKey
ALTER TABLE "fornecedor" ADD CONSTRAINT "fornecedor_id_endereco_fkey" FOREIGN KEY ("id_endereco") REFERENCES "endereco"("id_endereco") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fornecedor_produto" ADD CONSTRAINT "fornecedor_produto_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "fornecedor"("id_fornecedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fornecedor_produto" ADD CONSTRAINT "fornecedor_produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_id_endereco_fkey" FOREIGN KEY ("id_endereco") REFERENCES "endereco"("id_endereco") ON DELETE SET NULL ON UPDATE CASCADE;
