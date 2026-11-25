import { prisma } from '../../database.js';
import { validarConfiguracaoIA } from '../../utils/configuracaoIA.js';

// Aceita só os campos enviados (ex.: mudar apenas o intervalo).
export async function salvarConfiguracaoIA(corpo) {
  const dados = validarConfiguracaoIA(corpo);

  return prisma.configuracao_ia.upsert({
    where: { id_configuracao_ia: 1 },
    update: dados,
    create: { id_configuracao_ia: 1, ...dados },
  });
}

export default { salvarConfiguracaoIA };