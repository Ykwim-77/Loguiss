import { edit_empresa_service } from "../../services/empresa_service/edit_empresa.service.js";
import list_empresa_service from "../../services/empresa_service/list_empresa.service.js";

async function list_empresa(req, res) {
    await list_empresa_service(req, res);
}

async function edit_empresa(req, res) {
    await edit_empresa_service(req, res);
}

export default { list_empresa, edit_empresa }