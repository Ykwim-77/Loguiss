import express from 'express';
import controller from '../controllers/controller_receita/controller_receita.js';

const router_receita = express.Router();

router_receita.post('/create_receita', (req, res)=>{
    controller.create_receita(req, res);
})
router_receita.patch('/edit_receita', (req, res) =>{
    controller.edit_receita(req, res);
})

export default router_receita