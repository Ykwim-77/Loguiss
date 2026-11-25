import { prisma } from '../../database.js';

// Existe uma configuração só (id 1). Na primeira vez ela é criada com os valores padrão.
export async function buscarConfiguracaoIA() {
  return prisma.configuracao_ia.upsert({
    where: { id_configuracao_ia: 1 },
    update: {},
    create: { id_configuracao_ia: 1 },
  });
}

export default { buscarConfiguracaoIA };