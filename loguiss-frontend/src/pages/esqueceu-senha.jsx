import { useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Inputs } from '../components/inputs';
import { Button } from '../components/button';
import { validarFormatoEmail } from '../utils/validacoes';

function EsqueceuSenha() {

    const [email, setEmail] = useState('');

    const [email_tocado, setEmailTocado] = useState(false);

    const [enviar_formulario, setEnviarFormulario] = useState(false);

    const navigate = useNavigate();

    function formularioEnviado(e) {

        if (e && e.preventDefault) e.preventDefault();
        setEnviarFormulario(true);
        setEmailTocado(true);


        const erro = validarFormatoEmail(email);
        return !erro;
    }

    function handleVerificar(e) {
        if (e && e.preventDefault) e.preventDefault();
        const valido = formularioEnviado();
        if (valido) navigate('/codigo-verificacao');
    }

    const erro_email =
        (email_tocado || enviar_formulario)
            ? validarFormatoEmail(email)
            : "";

    const mostrarErro = email_tocado || enviar_formulario;

    return (

        <div className="bg-[#050212] h-screen w-screen flex items-center justify-center ">

            <div className="flex flex-col gap-5">

                <div className="flex w-full max-w-6xl rounded-xl overflow-hidden shadow-2xl">

                    <aside className="hidden lg:flex w-1/2 bg-[#0D0B12] items-center justify-center">

                        <img src="./images/imagem-estoque.png" alt="Imagem de estoque" className="w-full h-full" />

                    </aside>

                    <form onSubmit={formularioEnviado} className="bg-[#100E14] p-10 rounded-sm w-[400px] shadow-lg">

                        <img src="./images/logo.png" alt="Logo da Loguiss" className="w-20 h-20 mx-auto mb-4 rounded-xl" />

                        <p className="text-center text-green-500 mb-5">
                            Insira seu email cadastrado para receber as instruções de redefinição de senha.
                        </p>

                        <div className="flex items-center mb-4">

                            <Inputs
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setEmailTocado(true)}
                                error={erro_email}
                                touched={email_tocado || enviar_formulario}
                                icon={User}
                            />

                        </div>

                        {mostrarErro && validarFormatoEmail(email) && (
                            <p className="text-red-500 text-sm mb-3">
                                {validarFormatoEmail(email)}
                            </p>
                        )}

                        <Button
                            type="button"
                            className="bg-[#4EDB4E] hover:bg-[#3CB43C]"
                            onClick={handleVerificar}
                        >
                            Verificar email
                        </Button>

                        <Button
                            type="button"
                            className="bg-[#0B0819] hover:bg-[#170F3C]"
                            onClick={() => navigate('/login')}
                        >
                            Voltar para o login
                        </Button>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default EsqueceuSenha;



