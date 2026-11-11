import { useState } from 'react';
import { User, Package, Factory, ChartNoAxesCombined, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Inputs } from '../components/inputs';
import { Button } from '../components/button';
import { validarFormatoEmail } from '../utils/validacoes';

function EsqueceuSenha() {

    const [email, setEmail] = useState('');
    const [email_tocado, setEmailTocado] = useState(false);

    const [enviar_formulario, setEnviarFormulario] = useState(false);

    const [loading, setLoading] = useState(false); //para o "loading" na hora de enviar o email

    const navigate = useNavigate();

    function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);
        setEmailTocado(true);

        const erro = validarFormatoEmail(email);

        if (!erro) {
            navigate('/codigo-verificacao');
        }
    }

    const erro_email =
        (email_tocado || enviar_formulario)
            ? validarFormatoEmail(email)
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
                            <h1 className="text-2xl font-bold text-green-500 mb-2">Esqueceu a senha?</h1>
                            <p className="text-xs text-gray-400">Insira seu email cadastrado para receber as instruções de redefinição de senha.</p>
                        </div>
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
                        <Button
                            type="submit"
                            className="w-full p-3 mb-5 bg-[#4EDB4E] hover:bg-[#3CB43C]"
                        >
                            Verificar email
                        </Button>
                        <Button
                            type="button"
                            className="w-full p-3 bg-[#0B0819] hover:bg-[#170F3C]"
                            onClick={() => navigate('/login')}
                        >
                            Voltar para o login
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default EsqueceuSenha;
