import { create_categoria } from '../../services/categoria_service/create_categoria.service.js'
import { delete_categoria } from '../../services/categoria_service/delete_categoria.service.js';
import { edit_categoria } from '../../services/categoria_service/edit_categoria.service.js';
import list_categoria_service from '../../services/categoria_service/list_categoria.service.js';


async function criar_categoria(req, res) {
    await create_categoria(req, res);
}

async function editar_categoria(req, res) {
    await edit_categoria(req, res);
}

async function apagar_categoria(req, res) {
    await delete_categoria(req, res);
}

async function list_categorias(req, res) {
    await list_categoria_service(req, res);
}

export default { criar_categoria, editar_categoria, apagar_categoria, list_categorias}

