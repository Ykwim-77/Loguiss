import { useRef, useState } from 'react';
import { User, Lock, Eye, EyeClosed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from './../services/api_user.js'

function Login() {

    const [email, setEmail] = useState(''); 
    const [senha, setSenha] = useState(''); 

    const [email_tocado, setEmailTocado] = useState(false);
    const [senha_tocada, setSenhaTocada] = useState(false);

    const email_formato_valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); //verificar se o email tem um formato válido

    const [enviar_formulario, setEnviarFormulario] = useState(false);

    const [visualizar_senha, setVisualizarSenha] = useState(false);

    const navigate = useNavigate(); //hook do react-router-dom para navegação programática

    function validarEmail() {
        if(!email_tocado && !enviar_formulario){
            return "";
        } //se o email não foi tocado e o formulário não foi enviado, não exibe erros

        if(email.trim() === ""){
            return "O email é obrigatório";
        } //se o email estiver vazio, exibe mensagem de erro

        if (!email_formato_valido) {
            return 'Formato de email inválido';
        } // se o email não tiver um formato válido, exibe mensagem de erro

        return "";
    }

    function validarSenha() {
        if(!senha_tocada && !enviar_formulario){
            return "";
        } //se a senha não foi tocada e o formulário não foi enviado, não exibe erros

        if(senha.trim() === ""){
            return "A senha é obrigatória";
        } //se a senha estiver vazia, exibe mensagem de erro

        if(senha.length < 6){
            return "A senha deve conter no mínimo 6 caracteres";
        } //se a senha tiver menos de 6 caracteres, exibe mensagem de erro

        return "";
    }

    function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);

        setEmailTocado(true);
        setSenhaTocada(true);

        if (
            email.trim() === "" ||
            !email_formato_valido ||
            senha.trim() === "" ||
            senha.length < 6
        ) {
            return;
        }
    }
    const erro_email = validarEmail();
    const erro_senha = validarSenha();



    const email_ref = useRef();
    const senha_ref = useRef();

    async function login(e) {
        // e.preventDefault();

        const resposta = await api.post('/login',{
            email: email_ref.current.value, // pega o valor atual que foi digitado no input e manda para o back 
            senha: senha_ref.current.value // mesma lógica do email
        })
        console.log(resposta.data)
        localStorage.setItem("token", resposta.data.token)

        navigate()// aqui somente vai ser usado quando tiver a próxima página

    }
    return (

        <div className="min-h-screen bg-[#050212] flex items-center justify-center p-6">

            <div>
                
                <svg
                    className="absolute top-0 left-0 w-[320px] h-[250px] pointer-events-none"
                    viewBox="0 0 320 250"
                    fill="none"
                >
                    <path
                    d="M0 0H180C130 60 90 120 0 160V0Z"
                    fill="#4EDB4E"
                    />
                </svg>

                <svg
                    className="absolute bottom-0 right-0 w-[450px] h-[320px] pointer-events-none"
                    viewBox="0 0 450 320"
                    fill="none"
                >
                    <path
                    d="M450 320H0C180 280 320 220 390 100C410 60 425 20 450 0V320Z"
                    fill="#4EDB4E"
                    />
                </svg>

                <div className="flex w-full max-w-6xl rounded-xl overflow-hidden shadow-2xl">

                    <aside className="hidden lg:flex w-1/2 bg-[#0D0B12] items-center justify-center">

                        <img src="./images/imagem-estoque.png" alt="Imagem de estoque" className="w-full h-full"/>

                    </aside>

                    <form onSubmit={formularioEnviado} className="w-full lg:w-1/2 bg-[#100E14] p-10 rounded-sm w-[400px] shadow-lg">

                        <div>

                            <img src="./images/logo.png" alt="Logo da Loguiss" className="w-20 h-20 mx-auto mb-4 rounded-xl"/>

                            <h1 className="text-3xl font-bold text-green-500 text-center mb-5">Bem-vindo de volta!</h1>

                            <div className="flex items-center gap-3 bg-gray rounded-sm p-3 border border-gray-200 mb-4">

                                <User size={20} />

                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="w-full outline-none bg-transparent text-white"
                                    onChange={(e) => setEmail(e.target.value)} //atualiza o estado do email quando o usuário digitar
                                    onBlur={() => setEmailTocado(true)} //atualiza o estado de email_tocado para true quando o campo de email perder o foco
                                    value={email}
                                    ref={email_ref}
                                />

                            </div>

                            {erro_email && (
                                <p className="text-red-500 text-sm mb-3">
                                    {erro_email}
                                </p>
                            )}

                            <div className="flex items-center gap-3 bg-gray p-3 rounded-sm border border-gray-200 mb-1">

                                <Lock size={20} />

                                <input
                                    type={visualizar_senha ? "text" : "password"} //se o olho estiver aberto, o tipo do input será "text" para mostrar a senha, caso contrário, será "password" para ocultar a senha
                                    placeholder="Senha"
                                    className="w-full outline-none bg-transparent text-white"
                                    onChange={(e) => setSenha(e.target.value)} //atualiza o estado da senha quando o usuário digitar
                                    onBlur={() => setSenhaTocada(true)} //atualiza o estado de senha_tocada para true quando o campo de senha perder o foco
                                    value={senha}
                                    ref={senha_ref}
                                />

                            <button
                                    type="button"
                                    onClick={() => setVisualizarSenha(!visualizar_senha)}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {visualizar_senha ? <EyeClosed size={20} /> : <Eye size={20} />}
                                </button>

                            </div>

                            {erro_senha && (
                                <p className="text-red-500 text-sm mb-3">
                                    {erro_senha}
                                </p>
                            )}

                            <div className="flex justify-between items-center mb-5">
                                
                                <button
                                    type="button"
                                    onClick={() => navigate('/esqueceu-senha')} 
                                    className="text-xs text-gray-500 hover:underline hover:text-green-500"
                                >
                                Esqueci minha senha
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/cadastrar')} 
                                    className="text-xs text-gray-500 hover:underline hover:text-green-500"
                                >
                                Cadastre-se aqui
                                </button>

                            </div>

                            <button 
                                type="submit"
                                className="w-full p-3 cursor-pointer mt-5 bg-[#4EDB4E] border-none rounded-sm text-white font-bold hover:bg-[#3CB43C] transition-colors duration-300"
                                onClick={()=> login()}
                            >
                            Entrar
                            </button>

                        </div>
                                
                     </form>

                </div>

                </div>

            </div>

    )
}

export default Login;