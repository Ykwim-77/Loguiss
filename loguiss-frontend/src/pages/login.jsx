import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Package, Factory, ChartNoAxesCombined, ArrowUpRight } from 'lucide-react';

import { validarFormatoEmail, validarSenha } from '../utils/validacoes';
import { Button } from '../components/button';
import { ButtonEye } from '../components/buttonEye';
import { Inputs } from '../components/inputs';

import api_login from '../services/api.js';

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
                senha
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

    const erro_email = (email_tocado || enviar_formulario)
        ? validarFormatoEmail(email)
        : '';

    const erro_senha = (senha_tocada || enviar_formulario)
        ? validarSenha(senha)
        : '';

    return (
        <main className="min-h-screen bg-[#050212] flex items-center justify-center p-4">
            <div className="w-full max-w-[900px] flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-[#292631] shadow-2xl">
                <aside className="hidden lg:flex relative flex-col justify-between w-1/2 min-h-[470px] p-7 bg-[#0D1712] overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-72 h-72 bg-[#4EDB4E]/10 rounded-full blur-[90px]" />
                    <div className="absolute -bottom-32 -right-20 w-72 h-72 bg-[#4EDB4E]/10 rounded-full blur-[90px]" />
                    <div className="relative z-10 flex items-center gap-3">
                        <img src="./images/logo.png" alt="Logo Loguiss" className="w-10 h-10 object-contain" />
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-wide">LOGUISS</h2>
                            <p className="text-[9px] tracking-[2.5px] text-gray-400">GESTÃO INTELIGENTE</p>
                        </div>
                    </div>
                    <div className="relative z-10 my-5">
                        <span className="inline-block text-[10px] font-semibold tracking-widest text-[#4EDB4E] bg-[#4EDB4E]/10 px-3 py-1.5 rounded-full mb-4">
                            GESTÃO EM UM SÓ LUGAR
                        </span>
                        <h1 className="text-3xl font-bold text-white leading-tight mb-3">
                            Seu estoque sob controle.
                            <span className="block text-[#4EDB4E]">Seu negócio em evolução.</span>
                        </h1>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                            Simplifique a gestão, acompanhe sua operação e tome decisões mais inteligentes com o Loguiss.
                        </p>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#4EDB4E]/10 flex items-center justify-center shrink-0">
                                <Package size={18} className="text-[#4EDB4E]" />
                            </div>
                            <div>
                                <h3 className="text-white text-xs font-semibold">Controle de estoque</h3>
                                <p className="text-gray-400 text-[11px] mt-0.5">Acompanhe entradas, saídas e produtos.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#4EDB4E]/10 flex items-center justify-center shrink-0">
                                <Factory size={18} className="text-[#4EDB4E]" />
                            </div>
                            <div>
                                <h3 className="text-white text-xs font-semibold">Gestão de produção</h3>
                                <p className="text-gray-400 text-[11px] mt-0.5">Organize processos e acompanhe a produção.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#4EDB4E]/10 flex items-center justify-center shrink-0">
                                <ChartNoAxesCombined size={18} className="text-[#4EDB4E]" />
                            </div>
                            <div>
                                <h3 className="text-white text-xs font-semibold">Análise de dados</h3>
                                <p className="text-gray-400 text-[11px] mt-0.5">Transforme informações em decisões.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 mt-5">
                        <p className="text-gray-500 text-[10px]">Gestão mais simples, resultados melhores.</p>
                        <ArrowUpRight size={16} className="text-[#4EDB4E]" />
                    </div>
                </aside>
                <form onSubmit={formularioEnviado} className="w-full lg:w-1/2 min-h-[440px] bg-[#100E14] px-7 py-9 sm:px-10 flex flex-col justify-center">
                    <div className="w-full max-w-[340px] mx-auto">
                        <div className="text-center mb-7">
                            <h1 className="text-2xl font-bold text-green-500 mb-2">Bem-vindo de volta!</h1>
                            <p className="text-xs text-gray-400">Entre com suas credenciais para continuar.</p>
                        </div>
                        <div className="mb-4">
                            <Inputs
                                type="email"
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
                                className="rounded-lg border focus:border-[#4EDB4E] w-full"
                                rightElement={
                                    <ButtonEye
                                        visualizar_senha={visualizar_senha}
                                        setVisualizarSenha={setVisualizarSenha}
                                    />
                                }
                            />
                        </div>
                        <div className="flex justify-end mb-4">
                            <Button
                                type="button"
                                onClick={() => navigate('/esqueceu-senha')}
                                className="text-xs text-gray-400 hover:underline hover:text-green-500"
                            >
                                Esqueci minha senha
                            </Button>
                        </div>
                        <Button type="submit" className="bg-[#4EDB4E] hover:bg-[#3CB43C] w-full p-3 rounded-lg">
                            Entrar
                        </Button>
                        <div className="flex mt-4 items-start gap-2 text-xs text-gray-400">
                            <input
                                type="checkbox"
                                id="aceitar_termos"
                                required
                                className="mt-0.5 accent-[#4EDB4E] cursor-pointer"
                            />
                            <label htmlFor="aceitar_termos">
                                Eu li e aceito os{' '}
                                <a href="/termos" className="hover:underline hover:text-green-500">
                                    Termos de Serviço
                                </a>{' '}
                                e{' '}
                                <a href="/politicas" className="hover:underline hover:text-green-500">
                                    Políticas de Privacidade
                                </a>.
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Login;