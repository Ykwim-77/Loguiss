import create_movi_service from "../../services/movimentacao_service/create_movi.service.js"
import list_movimentacao_service from "../../services/movimentacao_service/list_movi.service.js";

async function create_movi(req, res) {
    await create_movi_service(req, res);
}
async function list_movi(req, res) {
    await list_movimentacao_service(req, res)
}

export default {create_movi, list_movi}