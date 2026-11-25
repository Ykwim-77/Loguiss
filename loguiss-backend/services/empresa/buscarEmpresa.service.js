import {prisma} from '../../database.js';

// Cada banco tem uma empresa só, então sempre buscamos o primeiro registro.
export async function buscarEmpresa() {
  return prisma.empresa.findFirst();
}

export default { buscarEmpresa };