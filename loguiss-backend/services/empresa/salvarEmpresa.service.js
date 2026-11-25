import { prisma } from '../../database.js';

// Cria a empresa se ainda não existir; se já existir, atualiza.
export async function salvarEmpresa(dados) {
  const existente = await prisma.empresa.findFirst();

  if (!existente) {
    return prisma.empresa.create({ data: dados });
  }

  return prisma.empresa.update({
    where: { id_empresa: existente.id_empresa },
    data: dados,
  });
}

export default { salvarEmpresa };