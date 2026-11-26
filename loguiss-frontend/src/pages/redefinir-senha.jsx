import { Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { ButtonEye } from '../components/buttonEye';
import { Inputs } from '../components/inputs';
import api from '../services/api';
import { validarSenha } from '../utils/validacoes';

function RedefinirSenha() {
    const [senha, setSenha] = useState('');
    const [confirmar_senha, setConfirmarSenha] = useState('');

    const [senha_tocada, setSenhaTocada] = useState(false);
    const [confirmar_senha_tocada, setConfirmarSenhaTocada] = useState(false);
    const [enviar_formulario, setEnviarFormulario] = useState(false);

    const [visualizar_senha, setVisualizarSenha] = useState(false);
    const [visualizar_confirmar_senha, setVisualizarConfirmarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

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

    async function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);
        setSenhaTocada(true);
        setConfirmarSenhaTocada(true);

        if (validarSenha(senha) || validarConfirmarSenha(senha, confirmar_senha)) {
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Sua verificação expirou. Solicite um novo código.');
            navigate('/esqueceu-senha');
            return;
        }

        try {
            setCarregando(true);

            const resposta = await api.post(
                '/user/recuperar_senha',
                {
                    senha_user: senha,
                    confirm_senha_user: confirmar_senha,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            toast.success(resposta.data.MSG || 'Senha alterada com sucesso!');

            localStorage.removeItem('token');

            navigate('/login');
        } catch (error) {
            const mensagem =
                error.response?.data?.MSG ||
                'Não foi possível redefinir sua senha. Tente novamente.';

            toast.error(mensagem);
        } finally {
            setCarregando(false);
        }
    }

    const erro_senha = senha_tocada || enviar_formulario ? validarSenha(senha) : '';

    const erro_confirmar_senha =
        confirmar_senha_tocada || enviar_formulario
            ? validarConfirmarSenha(senha, confirmar_senha)
            : '';

    return (
        <main className="min-h-screen bg-fundo flex items-center justify-center p-3">
            <div className="w-full max-w-[900px] flex flex-col lg:flex-row overflow-hidden rounded-2xl">
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
                    <div className="text-center mb-7">
                        <h1 className="text-2xl font-bold text-primaria mb-2">Redefinir senha</h1>

                        <p className="text-xs text-texto-suave">
                            Insira sua nova senha e confirme para concluir a redefinição.
                        </p>
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
                        disabled={carregando}
                        className="w-full mb-5"
                    >
                        {carregando ? 'Redefinindo...' : 'Redefinir senha'}
                    </Button>

                    <Button
                        type="button"
                        disabled={carregando}
                        variant="secondary"
                        className="w-full"
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