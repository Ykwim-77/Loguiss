import { gerarPrevisao } from '../services/previsao/gerarPrevisao.service.js';
import { buscarPrevisao } from '../services/previsao/buscarPrevisao.service.js';
import { HORIZONTES_VALIDOS } from '../utils/previsao/constantes.js';

function responderErro(res, erro) {
  if (erro.status) {
    return res.status(erro.status).json({ erro: erro.message, codigo: erro.codigo });
  }
  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno ao processar a previsão.' });
}

// POST /previsoes  { horizonteDias?, localizacao?, segmento?, idsProdutos? }
// Sem horizonteDias, usa o da configuração da IA.
async function gerar(req, res) {
  try {
    const resultado = await gerarPrevisao(req.body || {});
    return res.status(201).json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

// GET /previsoes/ultima?horizonte=14
async function ultima(req, res) {
  try {
    const horizonteDias = req.query.horizonte ? Number(req.query.horizonte) : undefined;
    if (horizonteDias !== undefined && !HORIZONTES_VALIDOS.includes(horizonteDias)) {
      return res
        .status(400)
        .json({ erro: `horizonte deve ser um destes valores: ${HORIZONTES_VALIDOS.join(', ')}.` });
    }

    const resultado = await buscarPrevisao({ horizonteDias });
    if (!resultado) {
      return res
        .status(404)
        .json({ erro: 'Ainda não existe uma previsão completa salva para este horizonte.' });
    }
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

// GET /previsoes/:id
async function obter(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ erro: 'Id inválido.' });
    }

    const resultado = await buscarPrevisao({ id });
    if (!resultado) {
      return res.status(404).json({ erro: 'Previsão não encontrada.' });
    }
    return res.json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}

export default { gerar, ultima, obter };