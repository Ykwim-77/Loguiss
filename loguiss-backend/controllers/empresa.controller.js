// Se você já ajustou o seu controller de empresa, basta acrescentar
// cidade, uf e segmento (veja textoOpcional e a validação da UF).
import { buscarEmpresa } from '../services/empresa/buscarEmpresa.service.js';
import { salvarEmpresa } from '../services/empresa/salvarEmpresa.service.js';

// undefined = campo não enviado (mantém o valor); texto vazio = limpa o campo.
function textoOpcional(valor) {
  if (valor === undefined) return undefined;
  return String(valor).trim() || null;
}

// GET /empresa
async function obter(req, res) {
  try {
    const empresa = await buscarEmpresa();

    if (!empresa) {
      return res.status(404).json({ erro: 'Empresa ainda não cadastrada.' });
    }

    return res.json(empresa);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao buscar a empresa.' });
  }
}

// PUT /empresa  { nome, cnpj, telefone, email, cidade?, uf?, segmento? }
async function salvar(req, res) {
  try {
    const { nome, cnpj, telefone, email, cidade, uf, segmento } = req.body;

    if (!nome || !cnpj || !telefone || !email) {
      return res.status(400).json({ erro: 'Informe nome, cnpj, telefone e email.' });
    }

    const ufTratada = textoOpcional(uf)?.toUpperCase();
    if (ufTratada && !/^[A-Z]{2}$/.test(ufTratada)) {
      return res.status(400).json({ erro: 'uf deve ter 2 letras, por exemplo: PR.' });
    }

    const empresa = await salvarEmpresa({
      nome,
      cnpj,
      telefone,
      email,
      cidade: textoOpcional(cidade),
      uf: ufTratada,
      segmento: textoOpcional(segmento),
    });

    return res.json(empresa);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao salvar a empresa.' });
  }
}

export default { obter, salvar };