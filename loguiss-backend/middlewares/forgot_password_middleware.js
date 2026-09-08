import express from 'express';
import jwt from 'jsonwebtoken';
import {prisma} from '../database.js'

export default async function forgot_password(req, res, next) {
    const AuthHeader = req.headers.authorization; //pega o token dos headers de autorização

    if(!AuthHeader){
        return res.status(403).json({MSG: "TOKEN não foi enviado!!"})
    }

    const token = AuthHeader.split(" ")[1]; // aqui pega apenas a parte importante do token JWT
    try{
        const decodificado = jwt.verify(token, process.env.CHAVE_JWT);
        
        const usuarioVerify = await prisma.user.findFirst({
            where:{
                id_user: decodificado.id,
                email: decodificado.email,
                verificacao:{
                    cod_verify: decodificado.codigo_verify
                }
            },
            include:{
                verificacao: true
            }
        })
        if(!usuarioVerify){
            return res.status(401).json({MSG: "usuário não existe em banco"})
        }

        req.user = decodificado

        next()



    }catch(error){
        return res.status(401).json(
            {
            MSG: "algum erro ai piá!(no auth no login)"
            }
        )
    }

    
}