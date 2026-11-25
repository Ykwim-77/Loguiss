// import { prisma } from '../database.js';
import { create_produto_service } from '../../services/produto_service/create_produto.service.js'
import { delete_produto_service } from '../../services/produto_service/delete_produto.service.js';
import { edit_produto_service } from '../../services/produto_service/edit_produto.service.js';
import list_produto_service from '../../services/produto_service/list_produto.service.js';



async function create_produto(req, res) {
    await create_produto_service(req, res);
}
async function list_produto(req, res) {
    await list_produto_service(req, res);   
}
async function delete_produto(req, res) {
    await delete_produto_service(req, res);
}
async function edit_produto(req, res) {
    await edit_produto_service(req, res);
};

export default {create_produto, list_produto, delete_produto, edit_produto};


// produto.controller.js

// import { criarProduto, buscarProduto } from "./produto.service.js";

// export async function criar(req, res) {
//   const produto = await criarProduto(req.body);

//   return res.status(201).json(produto);
// }

// export async function buscar(req, res) {
//   const produto = await buscarProduto(req.params.id);

//   return res.json(produto);
// }


