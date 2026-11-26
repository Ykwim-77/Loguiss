import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import api from '../services/api';
import { validarFormatoEmail } from '../utils/validacoes';

function EsqueceuSenha() {
    const [email, setEmail] = useState('');
    const [email_tocado, setEmailTocado] = useState(false);
    const [enviar_formulario, setEnviarFormulario] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);
        setEmailTocado(true);

        const erro = validarFormatoEmail(email);

        if (erro) {
            toast.error(erro);
            return;
        }

        try {
            setLoading(true);

            const response = await api.post('/login/cod_verify', {
                email: email.trim(),
            });

            toast.success(response.data.MSG || 'Código enviado para seu e-mail!');

            navigate('/codigo-verificacao', {
                state: {
                    email: email.trim(),
                    token: response.data.token,
                },
            });
        } catch (error) {
            console.error('Erro ao solicitar recuperação de senha:', error.response?.data || error);

            toast.error(
                error.response?.data?.MSG || 'Não foi possível enviar o código. Tente novamente.',
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-fundo flex items-center justify-center p-4">
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
                    <div className="w-full max-w-[340px] mx-auto">
                        <div className="text-center mb-7">
                            <h1 className="text-2xl font-bold text-primaria mb-2">
                                Esqueceu a senha?
                            </h1>

                            <p className="text-xs text-texto-suave">
                                Insira seu email cadastrado para receber as instruções de
                                redefinição de senha.
                            </p>
                        </div>

                        <div className="flex items-center mb-4">
                            <Inputs
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailTocado(true);
                                }}
                                placeholder="Ex: nome@dominio.com"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full mb-5"
                        >
                            {loading ? 'Enviando código...' : 'Verificar email'}
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => navigate('/login')}
                        >
                            Voltar para o login
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default EsqueceuSenha;