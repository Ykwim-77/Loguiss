// isso vai precisar ser concluído

async function cadastro_user(req, res) {
    const {email, senha, confirm_senha_user, cpf, telefone, nome_usuario} = req.body
    
    // aqui valida se está vindo tudo que é esperado
    if(!email || !senha || !confirm_senha_user || !cpf || !telefone || !nome_usuario){
        return res.status(406).json({MSG: "favor conferir se todos os dados foram preenchidos corretamente!!"})
    }
    // senhas precisam ser iguais
    if(senha != confirm_senha_user){
        return re.status(406).json({MSG: "as senhas devem ser iguais!!"})
    }
    if(!cpf.isValid(cpf)){
        return res.status(400).json({MGS: "informe um cpf válido"})
    }


    // aqui é feita a validação do cpf no sistema (só pode existir um no sistema)
    try{
        let user_encontrado = prisma.user.findFirst({
            where:{
                cpf: cpf
            }
        })
        if(user_encontrado != null || user_encontrado != undefined ){
            return res.status(409).json({MSG: "CPF já cadastrado!! favor insira um cpf válido!"})
        }


    }catch(error){
        console.log(error)
    }

    try{         //aqui valida se o email já existe no banco
        let user_encontrado = prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(user_encontrado != null || user_encontrado != undefined){
            return res.status(409).json({MSG: "Email já existe em banco!! favor inserir um email não utilizado"})
        }

    }catch(error){
        console.log(error)
    }






    



    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_APP,
        pass: senha_app
    }
    });

   try{
        const mailOptions = { // funcão principal para enviar email
            from: process.env.EMAIL_APP,
            to: user_encontrado.email,
            subject: "Validação de E-mail",
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
            Validação de E-mail
            </h1>

            <p style="color: #555; font-size: 16px;">
            Recebemos uma solicitação para confirmar sua identidade.
            </p>

            <p style="color: #555; font-size: 16px;">
            Utilize o link abaixo:
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

        console.log(resposta)
    }catch (erro) {
    console.error(erro);
}


}
