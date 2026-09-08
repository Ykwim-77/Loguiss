import express from 'express';
import controller from '../controllers/controller_login/controller_login.js';
import forgot_password from '../middlewares/forgot_password_middleware.js'

const router_login = express.Router();

router_login.post('/login', (req, res) => {
    controller.Login(req, res);
});

router_login.post('/cod_verify', (req,res) => {
    controller.cod_verify(req,res);
})
router_login.post('/verify_cod', (req, res)=> {
    controller.verify_cod(req, res)
})
router_login.patch('/recuperar_senha', forgot_password, (req, res)=>{
    controller.recuperar_senha(req ,res)
} )

export default router_login;