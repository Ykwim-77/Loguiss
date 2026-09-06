import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/button';

function CodigoVerificacao() {

    const navigate = useNavigate();

    const [enviar_formulario, setEnviarFormulario] = useState(false);

    const [codigo, setCodigo] = useState(['', '', '', '', '', '']); //estado para armazenar os valores dos 6 inputs do código de verificação

    const inputRefs = useRef([]); // Array para armazenar as referências dos inputs

    function atualizarCodigo(e, index) {
        const valor = (e.target.value || '').replace(/\D/g, '').slice(-1); // garante 1 dígito numérico
        const novoCodigo = [...codigo];
        novoCodigo[index] = valor;
        setCodigo(novoCodigo);

        if (valor && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function validarCodigo(codigoParam) {
        // aceita array ou string
        const codigoStr = Array.isArray(codigoParam) ? codigoParam.join('') : String(codigoParam || '');
        if (codigoStr.length !== 6) {
            return "Informe os 6 dígitos do código de verificação";
        }
        return "";
    }

    function handleKeyDown(e, index) {
        if (e.key === 'Backspace') {
            // se tem valor no campo atual -> apaga ele
            if (codigo[index]) {
                e.preventDefault();
                const novo = [...codigo];
                novo[index] = '';
                setCodigo(novo);
                return;
            }
            // se campo atual vazio, volta e apaga o anterior
            if (!codigo[index] && index > 0) {
                e.preventDefault();
                const prev = index - 1;
                const novo = [...codigo];
                novo[prev] = '';
                setCodigo(novo);
                inputRefs.current[prev]?.focus();
            }
        }
    }

    function formularioEnviado(e) {
        e.preventDefault();

        setEnviarFormulario(true);

        if (validarCodigo(codigo.join(''))) {
            return;
        }

        navigate('/redefinir-senha'); //navega para a tela de redefinir senha se o código for válido
    }

    const mostrarErro = enviar_formulario;

    return (

        <div className="bg-[#050212] h-screen w-screen flex items-center justify-center ">

            <div className="flex flex-col gap-5">

                <div className="flex w-full max-w-6xl rounded-xl overflow-hidden shadow-2xl">

                    <aside className="hidden lg:flex w-1/2 bg-[#0D0B12] items-center justify-center">

                        <img src="./images/imagem-estoque.png" alt="Imagem de estoque" className="w-full h-full" />

                    </aside>

                    <form onSubmit={formularioEnviado} className="bg-[#100E14] p-10 rounded-sm w-[400px] shadow-lg">

                        <img src="./images/logo.png" alt="Logo da Loguiss" className="w-20 h-20 mx-auto mb-4 rounded-xl" />

                        <p className="text-center text-green-500 mb-5">
                            Informe o código de verificação enviado para o seu email para redefinir sua senha.
                        </p>

                        <div className="flex justify-center gap-3 bg-gray rounded-sm  p-3 border border-gray-500 mb-4">

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={codigo[0]}
                                className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-sm"
                                onChange={(e) => atualizarCodigo(e, 0)}
                                onKeyDown={(e) => handleKeyDown(e, 0)}
                                ref={(el) => (inputRefs.current[0] = el)}
                                autoComplete="off"
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={codigo[1]}
                                className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-sm"
                                onChange={(e) => atualizarCodigo(e, 1)}
                                onKeyDown={(e) => handleKeyDown(e, 1)}
                                ref={(el) => (inputRefs.current[1] = el)}
                                autoComplete="off"
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={codigo[2]}
                                className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-sm"
                                onChange={(e) => atualizarCodigo(e, 2)}
                                onKeyDown={(e) => handleKeyDown(e, 2)}
                                ref={(el) => (inputRefs.current[2] = el)}
                                autoComplete="off"
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={codigo[3]}
                                className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-sm"
                                onChange={(e) => atualizarCodigo(e, 3)}
                                onKeyDown={(e) => handleKeyDown(e, 3)}
                                ref={(el) => (inputRefs.current[3] = el)}
                                autoComplete="off"
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={codigo[4]}
                                className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-sm"
                                onChange={(e) => atualizarCodigo(e, 4)}
                                onKeyDown={(e) => handleKeyDown(e, 4)}
                                ref={(el) => (inputRefs.current[4] = el)}
                                autoComplete="off"
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={codigo[5]}
                                className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-sm"
                                onChange={(e) => atualizarCodigo(e, 5)}
                                onKeyDown={(e) => handleKeyDown(e, 5)}
                                ref={(el) => (inputRefs.current[5] = el)}
                                autoComplete="off"
                            />

                        </div>

                        {mostrarErro && validarCodigo(codigo.join('')) && (
                            <p className="text-red-500 text-sm mb-3">
                                {validarCodigo(codigo.join(''))}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="bg-[#4EDB4E] hover:bg-[#3CB43C]">
                            Verificar código
                        </Button>

                        <Button
                            type="button"
                            className="bg-[#0B0819] hover:bg-[#170F3C]"
                            onClick={() => navigate('/login')}
                        >
                            Voltar para o login
                        </Button>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default CodigoVerificacao;