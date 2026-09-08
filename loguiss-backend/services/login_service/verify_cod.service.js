import { prisma } from '../../database.js';
import jwt from 'jsonwebtoken';



const chave_jwt = process.env.CHAVE_JWT // pega a chave dos JWTs da .env


export async function Verify_cod(req,res) {
    const {token_email, user_cod_verify} = req.body // pega o email e o código(que o user digitou) vindo do front

    const token_decodificado = jwt.verify(token_email, chave_jwt)

    console.log(user_cod_verify)
    const email_existente = await prisma.user.findFirst({ //primeiro procura para ver se bate com algum usuário do banco
        where:{
            email:token_decodificado.email,
            verificacao:{
                cod_verify: user_cod_verify
            }
        },
        include:{
            verificacao: true
        }
    })
    console.log(email_existente)
    if(!email_existente){ // se não bater com nenhum, o token é inválido
        return res.status(404).json({MSG:"token inválido, por favor insira novamente"})
    }

    const tempo = new Date() //pega a date e hora de agora
    
    if( tempo > email_existente.expira_em){ // verifica se a hora de agora é maior do que a hora que o token vai expirar
                                            // se for, entra aqui e acaba
        return res.status(406).json({MSG: "Código de verificação expirou, favor gerar novo código!"})
    }

    const token = jwt.sign({ // cria um token jwt para ser usado na hora de recuperar senha
                            // isso só vai servir para ter uma maior segurança 
        id: email_existente.id_user,
        email: email_existente.email,
        codigo_verify: email_existente.verificacao.cod_verify
    },
        chave_jwt,
    {
        expiresIn: "10m"
    });

    return res.status(200).json({ // aqui retorna o token jwt para o front usar 
        MSG: "Token válido, recuperação de senha permitida!!",
        token: token})

}