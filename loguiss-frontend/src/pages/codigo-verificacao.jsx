import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Package, Factory, ChartNoAxesCombined, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/button';

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
                    <div className="text-center mb-7">
                        <h1 className="text-2xl font-bold text-green-500 mb-2">Código de verificação</h1>
                        <p className="text-xs text-gray-400">Insira o código de verificação enviado para seu email.</p>
                    </div>
                    <div className="flex justify-center gap-3 bg-gray rounded-lg p-3 border border-gray-500 mb-4">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={codigo[0]}
                            className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-lg"
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
                            className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-lg"
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
                            className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-lg"
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
                            className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-lg"
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
                            className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-lg"
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
                            className="w-10 h-10 text-center text-green-500 text-sm font-bold border border-gray-300 rounded-lg"
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
                        className="w-full p-3 mb-5 bg-[#4EDB4E] hover:bg-[#3CB43C]">
                        Verificar código
                    </Button>
                    <Button
                        type="button"
                        className="w-full p-3 bg-[#0B0819] hover:bg-[#170F3C]"
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