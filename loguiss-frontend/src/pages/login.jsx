import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

//importação de components e funções reutilizáveis
import { validarFormatoEmail, validarSenha } from '../utils/validacoes';
import { Button } from '../components/button';
import { ButtonEye } from '../components/buttonEye';
import { Inputs } from '../components/inputs';

function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [email_tocado, setEmailTocado] = useState(false);
    const [senha_tocada, setSenhaTocada] = useState(false);

    const [enviar_formulario, setEnviarFormulario] = useState(false);

    const [visualizar_senha, setVisualizarSenha] = useState(false);

    const navigate = useNavigate(); //hook do react-router-dom para navegação programática


    function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);

        setEmailTocado(true);
        setSenhaTocada(true);

        if (validarFormatoEmail(email) || validarSenha(senha)) {
            return;
        }

        navigate('/home');

    }

    const erro_email =
        (email_tocado || enviar_formulario)
            ? validarFormatoEmail(email)
            : "";

    const erro_senha =
        (senha_tocada || enviar_formulario)
            ? validarSenha(senha)
            : "";

    return (

        <div className="relative min-h-screen bg-[#050212] flex items-center justify-center p-6">

            <div>

                <div className="flex h-[490px] w-full max-w-6xl rounded-xl overflow-hidden shadow-2xl">

                    <aside className="hidden lg:block w-1/2 h-full">

                        <img src="./images/imagem-estoque.png" alt="Imagem de estoque" className="w-full h-full object-cover" />

                    </aside>

                    <form onSubmit={formularioEnviado} className="w-full lg:w-1/2 h-full overflow-y-auto bg-[#100E14] p-10 overflow-y-hidden">

                        <img src="./images/logo.png" alt="Logo da Loguiss" className="w-20 h-20 mx-auto mb-4 rounded-xl" />

                        <h1 className="text-3xl font-bold text-green-500 text-center mb-5">Bem-vindo de volta!</h1>

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
                                className="rounded-lg border focus:border-[#4EDB4E] w-full"
                            />

                        </div>

                        {erro_email && (
                            <p className="text-red-500 text-sm mb-3">
                                {erro_email}
                            </p>
                        )}

                        <div className="flex items-center mb-1">

                            <Inputs
                                type={visualizar_senha ? "text" : "password"}
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                onBlur={() => setSenhaTocada(true)}
                                error={erro_senha}
                                touched={senha_tocada || enviar_formulario}
                                icon={Lock}
                                className="rounded-lg border focus:border-[#4EDB4E] w-full"
                                rightElement={
                                    <ButtonEye
                                        visualizar_senha={visualizar_senha}
                                        setVisualizarSenha={setVisualizarSenha}
                                    />
                                }
                            />

                        </div>

                        {erro_senha && (
                            <p className="text-red-500 text-sm mb-3">
                                {erro_senha}
                            </p>
                        )}

                        <div className="flex justify-between items-center mb-5">

                            <button
                                onClick={() => navigate('/esqueceu-senha')}
                                className="text-xs text-gray-500 hover:underline hover:text-green-500"
                            >
                                Esqueci minha senha
                            </button>

                        </div>

                        <Button
                            type="submit"
                            className="bg-[#4EDB4E] hover:bg-[#3CB43C] w-full p-3 mt-5">
                            Entrar
                        </Button>

                        <p className="mt-1 text-xs text-center text-gray-500">
                            <a href="/termos" className="hover:underline  hover:text-green-500">Termos de Serviço</a>
                            {" "} e {" "}
                            <a href="/politicas" className="hover:underline  hover:text-green-500">Políticas de Privacidade</a>.
                        </p>

                    </form>

                </div>

            </div>

        </div>

    )
}

export default Login;