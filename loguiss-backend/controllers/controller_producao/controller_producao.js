import { listar_producoes_service } from '../../services/producao_service/listar_producoes.service.js';
import { realizar_producao_service } from '../../services/producao_service/realizar_producao.service.js';

async function realizar_producao(req, res) {
    await realizar_producao_service(req, res);
}

async function listar_producoes(req, res) {
    await listar_producoes_service(req, res);
}

export default { realizar_producao, listar_producoes };
