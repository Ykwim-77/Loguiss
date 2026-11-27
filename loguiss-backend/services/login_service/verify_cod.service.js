import jwt from 'jsonwebtoken';
import { prisma } from '../../database.js';

export async function Verify_cod(req, res) {
    const { token_email, user_cod_verify } = req.body;

    if (!token_email || !user_cod_verify) {
        return res.status(400).json({ MSG: "Token e código de verificação são obrigatórios." });
    }

    const chave_jwt = process.env.CHAVE_JWT;

    try {
        const token_decodificado = jwt.verify(token_email, chave_jwt);

        const email_existente = await prisma.user.findFirst({
            where: {
                email: token_decodificado.email,
                verificacao: {
                    cod_verify: String(user_cod_verify)
                }
            },
            include: {
                verificacao: true
            }
        });

        if (!email_existente || !email_existente.verificacao) {
            return res.status(404).json({ MSG: "Código inválido, por favor insira novamente" });
        }

        const tempo = new Date();
        const expiracao = email_existente.verificacao.expira_em ?? email_existente.expira_em;

        if (expiracao && tempo > new Date(expiracao)) {
            return res.status(406).json({ MSG: "Código de verificação expirou, favor gerar novo código!" });
        }

        const token = jwt.sign(
            {
                id: email_existente.id_user,
                email: email_existente.email,
                codigo_verify: email_existente.verificacao.cod_verify
            },
            chave_jwt,
            {
                expiresIn: "10m"
            }
        );

        return res.status(200).json({
            MSG: "Token válido, recuperação de senha permitida!!",
            token: token
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ MSG: "Token inválido ou expirado." });
        }
        return res.status(500).json({ MSG: "Erro interno ao verificar o código." });
    }
}
