import { Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/button';
import { ButtonEye } from '../components/buttonEye';
import { Inputs } from '../components/inputs';
import api_login from '../services/api.js';
import { validarFormatoEmail, validarSenha } from '../utils/validacoes';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [email_tocado, setEmailTocado] = useState(false);
    const [senha_tocada, setSenhaTocada] = useState(false);
    const [enviar_formulario, setEnviarFormulario] = useState(false);
    const [visualizar_senha, setVisualizarSenha] = useState(false);

    const navigate = useNavigate();

    async function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);
        setEmailTocado(true);
        setSenhaTocada(true);

        if (validarFormatoEmail(email) || validarSenha(senha)) {
            return;
        }

        try {
            const resposta_login = await api_login.post('/login/login', {
                email,
                senha,
            });

            if (resposta_login.status === 200) {
                localStorage.setItem('token', resposta_login.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('Senha ou usuário incorreto!');
            } else {
                console.error('Erro ao realizar login:', error);
            }
        }
    }

    const erro_senha = senha_tocada || enviar_formulario ? validarSenha(senha) : '';

    return (
        <main className="min-h-screen bg-fundo flex items-center justify-center p-4">
            <div className="w-full max-w-[900px] flex flex-col lg:flex-row overflow-hidden rounded-2xl ">
                <aside className="hidden lg:flex relative w-1/2 min-h-[470px] overflow-hidden bg-superficie">
                    <img
                        src="/images/img-estoque.jpeg"
                        alt="Profissional utilizando o sistema Loguiss"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </aside>

                <form
                    onSubmit={formularioEnviado}
                    className="w-full lg:w-1/2 min-h-[440px] bg-superficie px-7 py-9 sm:px-10 flex flex-col justify-center"
                >
                    <div className="w-full max-w-[340px] mx-auto">
                        <img src="/images/logo.png" alt="Logo Loguiss" className="w-20 mx-auto" />
                        <div className="text-center mb-7">
                            <h1 className="text-2xl font-bold text-primaria mb-2">
                                Bem-vindo de volta!
                            </h1>
                            <p className="text-xs text-texto/60">
                                Entre com suas credenciais para continuar.
                            </p>
                        </div>
                        <div className="mb-4">
                            <Inputs
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ex: nome@dominio.com"
                                required
                            />
                        </div>
                        {/* Campo de senha */}
                        <div className="mb-2">
                            <Inputs
                                type={visualizar_senha ? 'text' : 'password'}
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                onBlur={() => setSenhaTocada(true)}
                                error={erro_senha}
                                touched={senha_tocada || enviar_formulario}
                                icon={Lock}
                                rightElement={
                                    <ButtonEye
                                        isOpen={visualizar_senha}
                                        onToggle={() => setVisualizarSenha((v) => !v)}
                                    />
                                }
                            />
                        </div>
                        <div className="flex justify-end mb-4">
                            <Button
                                type="button"
                                onClick={() => navigate('/esqueceu-senha')}
                                className="text-xs"
                                variant="link"
                            >
                                Esqueci minha senha
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            Entrar
                        </Button>
                        {/* Termos e políticas */}
                        <div className="flex mt-4 items-start gap-2 text-xs text-texto/60">
                            <input
                                type="checkbox"
                                id="aceitar_termos"
                                required
                                className="mt-0.5 accent-primaria cursor-pointer"
                            />
                            <label htmlFor="aceitar_termos">
                                Eu li e aceito os{' '}
                                <a
                                    href="/termos"
                                    className="text-texto hover:text-primaria hover:underline transition-colors"
                                >
                                    Termos de Serviço
                                </a>{' '}
                                e{' '}
                                <a
                                    href="/politicas"
                                    className="text-texto hover:text-primaria hover:underline transition-colors"
                                >
                                    Políticas de Privacidade
                                </a>
                                .
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Login;