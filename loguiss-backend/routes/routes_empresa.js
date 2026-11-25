import express from 'express';
import controller from '../controllers/controller_empresa/controller_empresa.js'

const router_empresa = express.Router();

router_empresa.get('/list_empresa', (req, res) => {
    controller.list_empresa(req, res);
})

router_empresa.patch('/edit_empresa/:id_empresa', (req, res) => {
    controller.edit_empresa(req, res)
})

export default router_empresa;