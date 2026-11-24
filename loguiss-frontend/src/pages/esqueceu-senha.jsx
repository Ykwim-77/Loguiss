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
        <main className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
            <div className="w-full max-w-[900px] flex flex-col lg:flex-row overflow-hidden rounded-2xl ">
                <aside className="hidden lg:flex relative w-1/2 min-h-[470px] overflow-hidden bg-[#1B1B1B]">
                    <img src="/images/img-estoque.jpeg" alt="Profissional utilizando o sistema Loguiss" className="absolute inset-0 w-full h-full object-cover object-center" />
                </aside>
                <form onSubmit={formularioEnviado} className="w-full lg:w-1/2 min-h-[440px] bg-[#1B1B1B] px-7 py-9 sm:px-10 flex flex-col justify-center">
                    <div className="w-full max-w-[340px] mx-auto">
                        <div className="text-center mb-7">
                            <h1 className="text-2xl font-bold text-[#A3E635] mb-2">Esqueceu a senha?</h1>
                            <p className="text-xs text-gray-400">Insira seu email cadastrado para receber as instruções de redefinição de senha.</p>
                        </div>
                        <div className="flex items-center mb-4">
                            <Inputs
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ex: nome@dominio.com"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-[#A3E635] hover:bg-[#BEF264] text-[#111111] font-bold w-full mb-5"
                        >
                            Verificar email
                        </Button>
                        <Button
                            type="button"
                            className="bg-[#F5F5F5] hover:bg-[#292929] text-[#111111] font-bold w-full"
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
