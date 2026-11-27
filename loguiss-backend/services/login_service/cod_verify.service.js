import dns from 'node:dns';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import { prisma } from '../../database.js';

export async function Cod_verify(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ MSG: "Envie o email para ser enviado o código de verificação por ele!!" });
    }

    const chave_jwt = process.env.CHAVE_JWT;
    const senha_app = process.env.SENHA_APP;
    const email_app = process.env.EMAIL_APP;

    if (!email_app || !senha_app) {
        console.error("Variáveis EMAIL_APP ou SENHA_APP não configuradas no ambiente.");
        return res.status(500).json({ MSG: "Configuração de e-mail indisponível no servidor." });
    }

    try {
        const email_existente = await prisma.user.findUnique({
            where: { email }
        });

        if (!email_existente) {
            return res.status(404).json({ MSG: "Email não existe!! faça o cadastro" });
        }

        const codigo_verify = String(Math.floor(100000 + Math.random() * 900000));
        const expira_em = new Date();
        expira_em.setMinutes(expira_em.getMinutes() + 15);

        await prisma.verificacao_user.update({
            where: { id_user: email_existente.id_user },
            data: {
                cod_verify: codigo_verify,
                expira_em: expira_em
            }
        });

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: email_app,
                pass: senha_app
            },
            lookup: (hostname, options, callback) => {
                dns.lookup(hostname, { ...options, family: 4 }, callback);
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000
        });

        const token = jwt.sign(
            {
                id: email_existente.id_user,
                email: email_existente.email
            },
            chave_jwt,
            { expiresIn: "10m" }
        );

        const mailOptions = {
            from: email_app,
            to: email_existente.email,
            subject: "Código de verificação",
            html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
        <div style="
            max-width: 500px;
            margin: auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
        ">
            <h1 style="color: #2e7d32; margin-bottom: 10px;">
            Verificação de Conta
            </h1>
            <p style="color: #555; font-size: 16px;">
            Recebemos uma solicitação para confirmar sua identidade.
            </p>
            <p style="color: #555; font-size: 16px;">
            Utilize o código abaixo:
            </p>
            <div style="
            background: #e8f5e9;
            color: #2e7d32;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            ">
            ${codigo_verify}
            </div>
            <p style="color: #777; font-size: 14px;">
            Este código expira em 10 minutos.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            <p style="color: #999; font-size: 12px;">
            Se você não solicitou este código, ignore este e-mail.
            </p>
        </div>
        </div>`
        };

        const resposta = await transporter.sendMail(mailOptions);
        console.log("Email enviado:", resposta.messageId);

        return res.status(201).json({ MSG: "Token criado e email enviado", token });
    } catch (erro) {
        console.error("Erro ao enviar email de verificação:", erro);
        return res.status(500).json({ MSG: "Erro ao enviar e-mail de verificação." });
    }
}
