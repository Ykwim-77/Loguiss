import { prisma } from '../../database.js';

export async function Recuperar_senha(req, res) {
    try {
        const usuario = req.user;
        const { senha_user, confirm_senha_user } = req.body;

        if (!senha_user || !confirm_senha_user) {
            return res.status(400).json({ MSG: "Informe a senha nos campos!!" });
        }

        if (senha_user !== confirm_senha_user) {
            return res.status(403).json({ MSG: "Senhas não correspondem, favor informar novamente!!" });
        }

        await prisma.user.update({
            where: {
                id_user: usuario.id
            },
            data: {
                senha: senha_user
            }
        });

        return res.status(200).json({ MSG: "Senha alterada" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ MSG: "Erro interno ao alterar a senha." });
    }
}
