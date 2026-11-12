import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Package, Factory, ChartNoAxesCombined, ArrowUpRight } from 'lucide-react';

import { Inputs } from '../components/inputs';
import { ButtonEye } from '../components/buttonEye';
import { Button } from '../components/button';
import { validarSenha } from '../utils/validacoes';

function RedefinirSenha() {

    const [senha, setSenha] = useState('');
    const [confirmar_senha, setConfirmarSenha] = useState('');

    const [senha_tocada, setSenhaTocada] = useState(false);
    const [confirmar_senha_tocada, setConfirmarSenhaTocada] = useState(false);

    const [enviar_formulario, setEnviarFormulario] = useState(false);

    const [visualizar_senha, setVisualizarSenha] = useState(false);
    const [visualizar_confirmar_senha, setVisualizarConfirmarSenha] = useState(false);

    const navigate = useNavigate();

    function validarConfirmarSenha(senha, confirmarSenha) {
        if (confirmarSenha.trim() === '') {
            return 'A confirmação da senha é obrigatória';
        }

        if (confirmarSenha !== senha) {
            return 'As senhas não coincidem';
        }

        return '';
    }

    function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);
        setSenhaTocada(true);
        setConfirmarSenhaTocada(true);

        if (
            validarSenha(senha) ||
            validarConfirmarSenha(senha, confirmar_senha)
        ) {
            return;
        }

        navigate('/login');
    }

    const erro_senha =
        (senha_tocada || enviar_formulario)
            ? validarSenha(senha)
            : '';

    const erro_confirmar_senha =
        (confirmar_senha_tocada || enviar_formulario)
            ? validarConfirmarSenha(senha, confirmar_senha)
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
                <form
                    onSubmit={formularioEnviado}
                    className="w-full lg:w-1/2 min-h-[440px] bg-[#100E14] px-7 py-9 sm:px-10 flex flex-col justify-center"
                >
                    <h1 className="text-2xl font-bold text-green-500 text-center mb-2">
                        Redefinir senha
                    </h1>
                    <p className="text-center text-green-500 mb-5 text-sm">
                        Digite sua nova senha e confirme para concluir a redefinição.
                    </p>
                    <div className="flex flex-col gap-4 mb-4">
                        <Inputs
                            type={visualizar_senha ? 'text' : 'password'}
                            placeholder="Nova senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            onBlur={() => setSenhaTocada(true)}
                            error={erro_senha}
                            touched={senha_tocada || enviar_formulario}
                            icon={Lock}
                            rightElement={
                                <ButtonEye
                                    visualizar_senha={visualizar_senha}
                                    setVisualizarSenha={setVisualizarSenha}
                                />
                            }
                        />
                        <Inputs
                            type={visualizar_confirmar_senha ? 'text' : 'password'}
                            placeholder="Confirmar nova senha"
                            value={confirmar_senha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            onBlur={() => setConfirmarSenhaTocada(true)}
                            error={erro_confirmar_senha}
                            touched={confirmar_senha_tocada || enviar_formulario}
                            icon={Lock}
                            rightElement={
                                <ButtonEye
                                    visualizar_senha={visualizar_confirmar_senha}
                                    setVisualizarSenha={setVisualizarConfirmarSenha}
                                />
                            }
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full p-3 mb-2 bg-[#4EDB4E] hover:bg-[#3CB43C]"
                    >
                        Redefinir senha
                    </Button>
                    <Button
                        type="button"
                        className="w-full p-3 bg-[#0B0819] hover:bg-[#170F3C] mt-3"
                        onClick={() => navigate('/login')}
                    >
                        Voltar para o login
                    </Button>
                </form>
            </div>
        </main>
    );
}

export default RedefinirSenha;
