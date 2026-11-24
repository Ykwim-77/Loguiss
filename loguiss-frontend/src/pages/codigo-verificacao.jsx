import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Package, Factory, ChartNoAxesCombined, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/button';
import { Inputs } from '../components/inputs';

import api from '../services/api.js'

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

    // const codDigitado = inputRefs.join("")
    const codigoArray = inputRefs.current // aqui vai "tranformar" o array do html para um convencional que de para usar de boa
        .map(input => input?.value || "")
        .join("");

    async function formularioEnviado(e) {
        e.preventDefault();

        console.log(localStorage.getItem("token"))

        try {
            const resposta = await api.post('/login/verify_cod', {
                token_email: localStorage.getItem("token"),
                user_cod_verify: codigoArray
            })

            localStorage.setItem("token", resposta.data.token)
            console.log(resposta.data.token)

        } catch (error) {
            console.log(error)
        }

        setEnviarFormulario(true);

        if (validarCodigo(codigo.join(''))) {
            return;
        }

        navigate('/redefinir-senha'); //navega para a tela de redefinir senha se o código for válido
    }

    const mostrarErro = enviar_formulario;

    return (
        <main className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
            <div className="w-full max-w-[900px] flex flex-col lg:flex-row overflow-hidden rounded-2xl ">
                <aside className="hidden lg:flex relative w-1/2 min-h-[470px] overflow-hidden bg-[#1B1B1B]">
                    <img src="/images/img-estoque.jpeg" alt="Profissional utilizando o sistema Loguiss" className="absolute inset-0 w-full h-full object-cover object-center" />
                </aside>
                <form onSubmit={formularioEnviado} className="w-full lg:w-1/2 min-h-[440px] bg-[#1B1B1B] px-7 py-9 sm:px-10 flex flex-col justify-center">
                    <div className="text-center mb-7">
                         <h1 className="text-2xl font-bold text-[#A3E635] mb-2">Código de verificação</h1>
                        <p className="text-xs text-gray-400">Insira o código de verificação enviado para seu email.</p>
                    </div>
                    <div className="mb-4 flex justify-center gap-3 rounded-lg border border-gray-500 bg-gray p-3">
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
                                inputClassName="h-10 w-full text-center text-sm font-bold text-green-500"
                            />
                        ))}
                    </div>
                    {mostrarErro && validarCodigo(codigo.join('')) && (
                        <p className="text-red-500 text-sm mb-3">
                            {validarCodigo(codigo.join(''))}
                        </p>
                    )}
                    <Button
                        type="submit"
                        className="bg-[#A3E635] hover:bg-[#BEF264] text-[#111111] font-bold w-full mb-5"
                    >
                        Verificar código
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

export default CodigoVerificacao;