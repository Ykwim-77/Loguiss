import express from 'express';
import controller from '../controllers/controller_categoria/controller_categoria.js'

const router_categoria = express.Router();

router_categoria.post('/create_categoria', (req, res)=> {
    controller.criar_categoria(req, res);   
})
router_categoria.patch('/edit_categoria', (req, res)=>{
    controller.editar_categoria(req,res)
})
router_categoria.delete('/delete_categoria', (req, res)=>{
    controller.apagar_categoria(req, res)
})
router_categoria.get('/list_categorias', (req, res)=>{
    controller.list_categorias(req, res)
})

export default router_categoria;