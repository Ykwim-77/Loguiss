import express from 'express';

import controller from '../controllers/controller_producao/controller_producao.js';

const router_producao = express.Router();

router_producao.post('/realizar', (req, res) => {
    controller.realizar_producao(req, res);
});

router_producao.get('/historico', (req, res) => {
    controller.listar_producoes(req, res);
});

export default router_producao;
