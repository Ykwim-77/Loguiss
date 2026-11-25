import { create_unidade_service } from "../../services/unidade_medida_service/create_unidade_medida.service.js";
import { Delete_unidade } from "../../services/unidade_medida_service/delete_unidade_medida.service.js";
import { edit_unidade_service } from "../../services/unidade_medida_service/edit_unidade_medida.service.js";
import list_unidade_service from "../../services/unidade_medida_service/list_unidade_medida.service.js";


async function list_unidade_medida(req, res) {
    await list_unidade_service(req, res);
}
async function delete_unidade_medida(req, res) {
    await Delete_unidade(req, res);
}
async function create_unidade_medida(req, res) {
    await create_unidade_service(req, res);
}

async function edit_unidade_medida(req, res) {
    await edit_unidade_service(req, res);
}

export default {list_unidade_medida, edit_unidade_medida, create_unidade_medida, delete_unidade_medida}