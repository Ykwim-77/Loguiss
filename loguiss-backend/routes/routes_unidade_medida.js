import express from 'express';
import controller from '../controllers/controller_unidade_medida/controller_unidade_medida.js';

const router_unidade_medida = express.Router();

router_unidade_medida.get('/list_unidade_medida', (req, res) => {
    controller.list_unidade_medida(req, res)
})
router_unidade_medida.delete('/delete_unidade_medida/:id_unidade', (req, res) =>{
    controller.delete_unidade_medida(req, res)
});
router_unidade_medida.post('/create_unidade_medida', (req, res) => {
    controller.create_unidade_medida(req, res)
});
router_unidade_medida.patch('/edit_unidade_medida/:id_unidade', (req, res) => {
    controller.edit_unidade_medida(req, res)
});

export default router_unidade_medida