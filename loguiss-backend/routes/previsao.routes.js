import { Router } from 'express';
import previsaoController from '../controllers/previsao.controller.js';

const router_previsao = Router();

router_previsao.post('/', previsaoController.gerar);
router_previsao.get('/ultima', previsaoController.ultima); // precisa vir antes de "/:id"
router_previsao.get('/:id', previsaoController.obter);

export default router_previsao;