import { prisma } from '../../database.js';


export async function Recuperar_senha(req, res){
    try{
        const usuario = req.user
        const {senha_user, confirm_senha_user} = req.body 
        // valida se veio tudo que está sendo esperado
        if(!senha_user || !confirm_senha_user){
            return res.status(400).json({MSG: "Informe a senha nos campos!!"})
        }
        // verifica se as senhas são iguais
        if(senha_user != confirm_senha_user){
            return res.status(403).json({MSG: "senhas não correspondem, favor informar novamente!!"})
        }
        // atualiza a senha do usuario
        await prisma.user.update({
            where:{
                id_user: usuario.id
            },
            data:{
                senha: senha_user
            }
        })
        return res.status(200).json({MSG: "senha alterada"})
        
    }catch(error){
        console.log(error)
    }
    
}
