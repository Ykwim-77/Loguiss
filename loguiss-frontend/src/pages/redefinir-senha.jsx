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
        <main className="min-h-screen bg-[#111111] flex items-center justify-center p-3">
            <div className="w-full max-w-[900px] flex flex-col lg:flex-row overflow-hidden rounded-2xl ">
                <aside className="hidden lg:flex relative w-1/2 min-h-[470px] overflow-hidden bg-[#1B1B1B]">
                    <img src="/images/img-estoque.jpeg" alt="Profissional utilizando o sistema Loguiss" className="absolute inset-0 w-full h-full object-cover object-center" />
                </aside>
                <form
                    onSubmit={formularioEnviado}
                    className="w-full lg:w-1/2 min-h-[440px] bg-[#1B1B1B] px-7 py-9 sm:px-10 flex flex-col justify-center"
                >
                    <div className="text-center mb-7">
                         <h1 className="text-2xl font-bold text-[#A3E635] mb-2">Redefinir senha</h1>
                        <p className="text-xs text-gray-400">Insira sua nova senha e confirme para concluir a redefinição.</p>
                    </div>
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
                                    isOpen={visualizar_senha}
                                    onToggle={() => setVisualizarSenha((v) => !v)}
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
                                    isOpen={visualizar_confirmar_senha} 
                                    onToggle={() => setVisualizarConfirmarSenha((v) => !v)} 
                                    />
                            }
                        />
                    </div>
                    <Button
                        type="submit"
                        className="bg-[#A3E635] hover:bg-[#BEF264] text-[#111111] font-bold w-full mb-5"
                    >
                        Redefinir senha
                    </Button>
                    <Button
                        type="button"
                        className="bg-[#F5F5F5] hover:bg-[#292929] text-[#111111] font-bold w-full"
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
