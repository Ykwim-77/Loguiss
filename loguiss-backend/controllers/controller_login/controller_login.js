import { login } from '../../services/login_service/login.service.js';
import { Cod_verify } from '../../services/login_service/cod_verify.service.js';
import { Verify_cod } from '../../services/login_service/verify_cod.service.js';
import { Recuperar_senha } from '../../services/login_service/recuperar_senha.service.js';

async function Login (req,res) {
    await login(req,res);
}

async function cod_verify(req,res) {
    await Cod_verify(req, res);
}

async function verify_cod(req,res) {
    await Verify_cod(req, res);
}
async function recuperar_senha(req, res){
    await Recuperar_senha(req, res);
}



export default {Login, cod_verify, verify_cod, recuperar_senha}