import { useState } from 'react';
import { toast } from 'sonner';

import { CreditCard, BriefcaseBusiness, Building2, Hash, Mail, Phone, CalendarDays, Check, Sun, Moon, MoonStar, Waves, Save, RotateCcw, Gift, Package, Crown, Clock3 } from 'lucide-react';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { CustomCard } from '../components/card';
import { Secao } from '../components/secao';
import { dadosDaEmpresa } from '../data/dashboardData';
import { planos } from '../data/dashboardData';
import { cn } from '../utils/cn';
import { formatarCPFCNPJ, formatarTelefone, validarFormatoEmail } from '../utils/validacoes';

const temas = [
    { id: 'dark', nome: 'Modo escuro', icone: Moon, cor: '#111111' },
    { id: 'light', nome: 'Modo claro', icone: Sun, cor: '#F5F5F5' },
    { id: 'midnight-dark', nome: 'Midnight dark', icone: MoonStar, cor: '#07080D' },
    { id: 'midnight-blue', nome: 'Midnight blue', icone: Waves, cor: '#071426' },
];

const TOTAL_DIAS_TESTE = 14;
const FIM_TESTE = new Date('2026-11-27T23:59:59');

// definido fora do componente: não precisa ser recriado a cada render
const campos = [
    { id: 'nome', label: 'Nome', icone: Building2, tipo: 'text' },
    { id: 'cnpj', label: 'CNPJ', icone: Hash, tipo: 'text', formatar: formatarCPFCNPJ },
    { id: 'telefone', label: 'Telefone', icone: Phone, tipo: 'tel', formatar: formatarTelefone },
    { id: 'email', label: 'E-mail', icone: Mail, tipo: 'email' },
];

const soDigitos = (valor) => valor.replace(/\D/g, '');

function validarEmpresa(empresa) {
    const telefone = soDigitos(empresa.telefone);
    return {
        nome: empresa.nome.trim() ? '' : 'O nome é obrigatório',
        cnpj: soDigitos(empresa.cnpj).length === 14 ? '' : 'CNPJ incompleto',
        telefone: telefone.length === 10 || telefone.length === 11 ? '' : 'Telefone inválido',
        email: validarFormatoEmail(empresa.email),
    };
}

function Configuracoes() {
    const [empresa, setEmpresa] = useState(dadosDaEmpresa);
    const [dadosSalvos, setDadosSalvos] = useState(dadosDaEmpresa);
    const [tentouSalvar, setTentouSalvar] = useState(false);
    const [temaSelecionado, setTemaSelecionado] = useState('dark');

    const [showPlansForm, setShowPlansForm] = useState(false);

    const abrirCardPlanos = () => {
            setShowPlansForm(true);
        };

    const fecharCardPlanos = () => {
        setShowPlansForm(false);
    };

    const salvo = JSON.stringify(empresa) === JSON.stringify(dadosSalvos);
    const erros = validarEmpresa(empresa);

    const diasRestantes = Math.min(
        TOTAL_DIAS_TESTE,
        Math.max(0, Math.ceil((FIM_TESTE - new Date()) / 86400000))
    );
    const diasUtilizados = TOTAL_DIAS_TESTE - diasRestantes;
    const percentualRestante = Math.round((diasRestantes / TOTAL_DIAS_TESTE) * 100);

    const alterarCampo = (id, valor) => {
        setEmpresa((atual) => ({ ...atual, [id]: valor }));
    };

    function salvarAlteracoes(event) {
        event.preventDefault();
        setTentouSalvar(true);

        if (Object.values(erros).some(Boolean)) {
            toast.error('Corrija os campos destacados.');
            return;
        }

        setDadosSalvos(empresa);
        setTentouSalvar(false);
        toast.success('Informações da empresa salvas.');
    }

    function descartarAlteracoes() {
        setEmpresa(dadosSalvos);
        setTentouSalvar(false);
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                <header className="mb-5">
                    <h1 className="text-3xl font-bold text-[#F5F5F5]">Configurações</h1>
                    <p className="text-[#A3A3A3]">
                        Esta é a página de configurações. Aqui você pode gerenciar
                        todas as configurações e personalizações do sistema.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <Secao
                        icone={BriefcaseBusiness}
                        titulo="Informações da empresa"
                        descricao="Dados da empresa usados no sistema e nos documentos."
                    >
                        <form onSubmit={salvarAlteracoes} className="mt-6 space-y-4">
                            {campos.map(({ id, label, icone, tipo, formatar }) => (
                                <Inputs
                                    key={id}
                                    id={id}
                                    label={label}
                                    type={tipo}
                                    icon={icone}
                                    value={empresa[id]}
                                    onChange={(e) =>
                                        alterarCampo(id, formatar ? formatar(e.target.value) : e.target.value)
                                    }
                                    error={erros[id]}
                                    touched={tentouSalvar}
                                />
                            ))}

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#292929] pt-4">
                                <span className="text-xs text-gray-500">
                                    {salvo ? 'Dados atualizados' : 'Alterações não salvas'}
                                </span>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={descartarAlteracoes}
                                        disabled={salvo}
                                    >
                                        <RotateCcw size={15} />
                                        Descartar
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="flex items-center gap-2 bg-[#A3E635] text-[#111111] hover:bg-[#BEF264]"
                                        disabled={salvo}
                                    >
                                        <Save size={15} />
                                        Salvar alterações
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Secao>

                    <Secao
                        icone={CreditCard}
                        titulo="Situação do plano"
                        descricao="Acompanhe o período de avaliação da sua conta."
                    >
                        <div className="mt-6 rounded-lg border border-[#292929] bg-[#151515] p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">
                                        Plano atual
                                    </span>
                                    <p className="mt-1 text-lg font-semibold">Teste grátis</p>
                                </div>
                                <span className="px-3 py-1 text-sm font-medium text-[#A3E635]">
                                    {diasRestantes > 0 ? 'Ativo' : 'Expirado'}
                                </span>
                            </div>

                            <div className="mt-5 flex items-center gap-4">
                                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-[5px] border-[#A3E635]">
                                    <span className="text-2xl font-bold">{diasRestantes}</span>
                                    <span className="text-[10px] uppercase text-gray-400">dias</span>
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {diasRestantes} {diasRestantes === 1 ? 'dia restante' : 'dias restantes'}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        de {TOTAL_DIAS_TESTE} dias do período de teste
                                    </p>
                                    <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                        <CalendarDays size={14} />
                                        O teste termina em{' '}
                                        {FIM_TESTE.toLocaleDateString('pt-BR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="mb-2 flex justify-between text-xs text-gray-400">
                                    <span>{diasUtilizados} de {TOTAL_DIAS_TESTE} dias utilizados</span>
                                    <span>{percentualRestante}% restantes</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-[#303030]">
                                    <div
                                        className="h-full rounded-full bg-[#A3E635]"
                                        style={{ width: `${percentualRestante}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="button"
                            className="mt-4 w-full bg-[#A3E635] text-[#111111] hover:bg-[#BEF264]"
                            onClick={abrirCardPlanos}
                        >
                            Fazer upgrade
                        </Button>
                    </Secao>

                    <Secao
                        icone={Sun}
                        titulo="Modo de exibição"
                        descricao="Escolha como deseja visualizar o sistema."
                        className="xl:col-span-2"
                    >
                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {temas.map(({ id, nome, icone: Icon, cor }) => {
                                const selecionado = temaSelecionado === id;

                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setTemaSelecionado(id)}
                                        aria-pressed={selecionado}
                                        className={cn(
                                            'rounded-xl border p-3 text-left transition',
                                            selecionado
                                                ? 'border-[#A3E635] bg-[#A3E635]/10'
                                                : 'border-[#303030] hover:border-[#555555]'
                                        )}
                                    >
                                        <div
                                            className="mb-3 h-16 rounded-lg border border-[#333333] p-2"
                                            style={{ backgroundColor: cor }}
                                        >
                                            <div className="h-2 w-12 rounded bg-[#A3E635]" />
                                            <div className="mt-2 h-2 w-20 rounded bg-gray-500/50" />
                                            <div className="mt-2 h-5 rounded border border-gray-500/30 bg-gray-500/10" />
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                <Icon size={16} className="text-[#A3E635]" />
                                                {nome}
                                            </span>
                                            {selecionado && <Check size={16} className="text-[#A3E635]" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </Secao>
                </div>
            </main>
            {showPlansForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-4xl rounded-xl border border-[#343434] bg-[#1B1B1B] p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-[#F5F5F5]">
                                Nossos planos
                            </h2>

                            <button
                                type="button"
                                onClick={fecharCardPlanos}
                                className="text-2xl text-[#A3A3A3] hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <p className="mb-6 text-[#A3A3A3]">
                            Entre em contato com nossa equipe para mais informações sobre os planos e recursos disponíveis escolhendo o que mais se adapta a sua realidade.
                        </p>

                       <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            {planos.map(({ id, nome, icone: Icone, selo, seloIcone: SeloIcone, descricao, rotuloPreco, preco, estilo }) => (
                                <CustomCard
                                    key={id}
                                    className={cn('flex flex-col transition-all duration-300 hover:-translate-y-1', estilo.card)}
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl text-primaria', estilo.icone)}>
                                            <Icone size={23} />
                                        </div>
                                        <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider', estilo.selo)}>
                                            {SeloIcone && <SeloIcone size={12} />}
                                            {selo}
                                        </span>
                                    </div>

                                    <h3 className="mb-2 text-xl font-bold text-texto">{nome}</h3>
                                    <p className="mb-5 text-sm leading-relaxed text-texto-suave">{descricao}</p>

                                    <div className="mt-auto border-t border-borda pt-4">
                                        <p className="text-xs font-medium uppercase tracking-wider text-texto-suave">{rotuloPreco}</p>
                                        <p className="mt-1 text-2xl font-extrabold text-primaria">
                                            {preco}<span className="text-sm font-medium text-texto-suave">/mês</span>
                                        </p>
                                    </div>
                                </CustomCard>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Configuracoes;
