import express from 'express';
import configuracaoIAController from '../controllers/configuracaoIA.controller.js';

const router_config_ia = express.Router();

router_config_ia.get('/', (req, res) => {
    configuracaoIAController.obter(req, res);
});

router_config_ia.put('/', (req, res) => {
    configuracaoIAController.salvar(req, res);
});

export default router_config_ia;