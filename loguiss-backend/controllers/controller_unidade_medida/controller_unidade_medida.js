import list_unidade_service from "../../services/unidade_medida_service/list_unidade_medida.service.js";


async function list_unidade_medida(req, res) {
    await list_unidade_service(req, res);
}
export default {list_unidade_medida}