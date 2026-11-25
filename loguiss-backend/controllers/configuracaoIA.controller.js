import { buscarConfiguracaoIA } from '../services/configuracaoIA/buscarConfiguracaoIA.service.js';
import { salvarConfiguracaoIA } from '../services/configuracaoIA/salvarConfiguracaoIA.service.js';
import { formatarConfiguracaoIA } from '../utils/configuracaoIA.js';
import { reagendar, statusAgendador } from '../jobs/agendadorPrevisao.js';

function responderErro(res, erro) {
  if (erro.status) {
    return res.status(erro.status).json({ erro: erro.message, codigo: erro.codigo });
  }
  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno ao processar a configuração da IA.' });
}

// GET /configuracao-ia
async function obter(req, res) {
  try {
    const configuracao = await buscarConfiguracaoIA();
    return res.json({ ...formatarConfiguracaoIA(configuracao), ...statusAgendador() });
  } catch (erro) {
    return responderErro(res, erro);
  }
}

// PUT /configuracao-ia  { horizonteDias?, intervaloMinutos?, agendamentoAtivo?, prazoReposicaoPadraoDias? }
async function salvar(req, res) {
  try {
    const configuracao = await salvarConfiguracaoIA(req.body || {});

    // A contagem do agendador recomeça com a nova configuração.
    await reagendar();

    return res.json({ ...formatarConfiguracaoIA(configuracao), ...statusAgendador() });
  } catch (erro) {
    return responderErro(res, erro);
  }
}

export default { obter, salvar };