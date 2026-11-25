import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import api from '../services/api.js';

function CodigoVerificacao() {
    const navigate = useNavigate();
    const location = useLocation();

    const [enviar_formulario, setEnviarFormulario] = useState(false);
    const [loading, setLoading] = useState(false);

    const [codigo, setCodigo] = useState(['', '', '', '', '', '']);

    const inputRefs = useRef([]);

    // Recupera o token enviado pela página anterior
    const token_email = location.state?.token;

    function atualizarCodigo(e, index) {
        const valor = (e.target.value || '').replace(/\D/g, '').slice(-1);

        const novoCodigo = [...codigo];
        novoCodigo[index] = valor;

        setCodigo(novoCodigo);

        if (valor && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function validarCodigo(codigoParam) {
        const codigoStr = Array.isArray(codigoParam)
            ? codigoParam.join('')
            : String(codigoParam || '');

        if (codigoStr.length !== 6) {
            return 'Informe os 6 dígitos do código de verificação';
        }

        return '';
    }

    function handleKeyDown(e, index) {
        if (e.key === 'Backspace') {
            if (codigo[index]) {
                e.preventDefault();

                const novo = [...codigo];
                novo[index] = '';

                setCodigo(novo);
                return;
            }

            if (index > 0) {
                e.preventDefault();

                const novo = [...codigo];
                novo[index - 1] = '';

                setCodigo(novo);
                inputRefs.current[index - 1]?.focus();
            }
        }
    }

    async function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);

        const codigoDigitado = codigo.join('');
        const erro = validarCodigo(codigoDigitado);

        if (erro) {
            return;
        }

        if (!token_email) {
            toast.error('Sessão de recuperação não encontrada. Solicite um novo código.');
            navigate('/esqueceu-senha');
            return;
        }

        try {
            setLoading(true);

            const resposta = await api.post('/login/verify_cod', {
                token_email: token_email,
                user_cod_verify: codigoDigitado,
            });

            // Guarda o token autorizado para redefinir a senha
            localStorage.setItem('token', resposta.data.token);

            toast.success(resposta.data.MSG || 'Código verificado com sucesso!');

            navigate('/redefinir-senha');
        } catch (error) {
            console.error('Erro ao verificar código:', error.response?.data || error);

            toast.error(error.response?.data?.MSG || 'Não foi possível verificar o código.');
        } finally {
            setLoading(false);
        }
    }

    const mostrarErro = enviar_formulario;

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
                    <div className="text-center mb-7">
                        <h1 className="text-2xl font-bold text-primaria mb-2">
                            Código de verificação
                        </h1>

                        <p className="text-xs text-texto-suave">
                            Insira o código de verificação enviado para seu email.
                        </p>
                    </div>

                    <div className="mb-4 flex justify-center gap-3 rounded-lg border border-borda p-3">
                        {codigo.map((digito, index) => (
                            <Inputs
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digito}
                                onChange={(e) => atualizarCodigo(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    {mostrarErro && validarCodigo(codigo.join('')) && (
                        <p className="text-perigo-texto text-sm mb-3">
                            {validarCodigo(codigo.join(''))}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full mb-5"
                    >
                        {loading ? 'Verificando...' : 'Verificar código'}
                    </Button>

                    <Button
                        type="button"
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

export default CodigoVerificacao;