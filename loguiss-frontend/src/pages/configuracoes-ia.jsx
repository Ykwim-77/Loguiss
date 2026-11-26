import { CalendarDays, ChartBarDecreasing, RefreshCw, RotateCcw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { Secao } from '../components/secao';
import { SideBar } from '../components/sidebar';
import api from '../services/api';

const dadosIniciais = {
    dias: '14',
    tempoAtualizacao: '1440',
    agendamentoAtivo: false,
};

const campos = [
    {
        id: 'dias',
        label: 'Dias de previsão',
        icone: CalendarDays,
        tipo: 'select',
        options: [
            { value: '5', label: '5 dias' },
            { value: '10', label: '10 dias' },
            { value: '14', label: '14 dias' },
            { value: '30', label: '30 dias' },
        ],
    },
];

const intervalos = [
    { value: '15', label: 'A cada 15 minutos' },
    { value: '30', label: 'A cada 30 minutos' },
    { value: '60', label: 'A cada 1 hora' },
    { value: '1440', label: 'A cada 24 horas' },
];

function formatarConfiguracao(configuracao) {
    return {
        dias: String(configuracao.horizonteDias),
        tempoAtualizacao: String(configuracao.intervaloMinutos),
        agendamentoAtivo: configuracao.agendamentoAtivo,
    };
}

function ConfiguracoesIA() {
    const [IA, setIA] = useState(dadosIniciais);
    const [dadosSalvos, setDadosSalvos] = useState(dadosIniciais);
    const [tentouSalvar, setTentouSalvar] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const salvo = JSON.stringify(IA) === JSON.stringify(dadosSalvos);
    const erros = {
        dias: !IA.dias ? 'Selecione o horizonte da previsão' : '',
        tempoAtualizacao: !IA.tempoAtualizacao ? 'Selecione um intervalo de atualização' : '',
    };

    useEffect(() => {
        let ativo = true;

        async function carregarConfiguracao() {
            try {
                const resposta = await api.get('/config_ia');
                if (!ativo) return;
                const configuracao = formatarConfiguracao(resposta.data);
                setIA(configuracao);
                setDadosSalvos(configuracao);
            } catch (error) {
                if (ativo) {
                    toast.error(
                        error.response?.data?.erro ||
                            'Não foi possível carregar as configurações de IA.',
                    );
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarConfiguracao();
        return () => {
            ativo = false;
        };
    }, []);

    const alterarCampo = (id, valor) => {
        setIA((atual) => ({
            ...atual,
            [id]: valor,
        }));
    };

    async function salvarAlteracoes(event) {
        event.preventDefault();
        setTentouSalvar(true);

        if (Object.values(erros).some(Boolean)) {
            toast.error('Corrija os campos destacados.');
            return;
        }

        setSalvando(true);
        try {
            const resposta = await api.put('/config_ia', {
                horizonteDias: Number(IA.dias),
                intervaloMinutos: Number(IA.tempoAtualizacao),
                agendamentoAtivo: IA.agendamentoAtivo,
            });
            const configuracao = formatarConfiguracao(resposta.data);
            setIA(configuracao);
            setDadosSalvos(configuracao);
            setTentouSalvar(false);
            toast.success('Configurações de IA salvas com sucesso!');
        } catch (error) {
            toast.error(
                error.response?.data?.erro || 'Não foi possível salvar as configurações de IA.',
            );
        } finally {
            setSalvando(false);
        }
    }

    function descartarAlteracoes() {
        setIA({ ...dadosSalvos });
        setTentouSalvar(false);
        toast.info('Alterações descartadas.');
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-[var(--text)]">Configurações de IA</h1>

                    <p className="mt-1 text-[var(--text-secondary)]">
                        Personalize os parâmetros utilizados pela inteligência artificial para gerar
                        previsões e analisar os dados do seu estoque.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <Secao
                        icone={ChartBarDecreasing}
                        titulo="Margem de previsão | Atualização de dados"
                        descricao="Defina quantos dias e em qual frequência de previsão deseja visualizar os dados nos gráficos e análises."
                    >
                        <form onSubmit={salvarAlteracoes} className="mt-6 space-y-4">
                            {campos.map(({ id, label, icone, tipo, options }) => (
                                <Inputs
                                    key={id}
                                    id={id}
                                    label={label}
                                    type={tipo}
                                    icon={icone}
                                    options={options}
                                    value={IA[id]}
                                    onChange={(e) => alterarCampo(id, e.target.value)}
                                    error={erros[id]}
                                    touched={tentouSalvar}
                                    disabled={carregando || salvando}
                                />
                            ))}
                            <Inputs
                                id="tempoAtualizacao"
                                label="Tempo de atualização"
                                type="select"
                                icon={RefreshCw}
                                options={intervalos}
                                value={IA.tempoAtualizacao}
                                onChange={(e) => alterarCampo('tempoAtualizacao', e.target.value)}
                                error={erros.tempoAtualizacao}
                                touched={tentouSalvar}
                                disabled={carregando || salvando}
                            />
                            <label className="flex items-center gap-3 text-sm text-[var(--text)]">
                                <input
                                    type="checkbox"
                                    checked={IA.agendamentoAtivo}
                                    onChange={(e) =>
                                        alterarCampo('agendamentoAtivo', e.target.checked)
                                    }
                                    disabled={carregando || salvando}
                                    className="h-4 w-4 accent-[var(--primary)]"
                                />
                                Ativar geração automática de previsões
                            </label>

                            <p className="text-xs text-[var(--text-secondary)]">
                                O agendamento usa o intervalo selecionado. O mínimo permitido é 15
                                minutos.
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                                <span className="text-xs text-[var(--text-secondary)]">
                                    {salvo ? 'Dados atualizados' : 'Alterações não salvas'}
                                </span>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={descartarAlteracoes}
                                        disabled={salvo || carregando || salvando}
                                    >
                                        <RotateCcw size={15} />
                                        Descartar
                                    </Button>

                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        disabled={salvo || carregando || salvando}
                                    >
                                        <Save size={15} />
                                        {salvando ? 'Salvando...' : 'Salvar alterações'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Secao>
                </div>
            </main>
        </div>
    );
}

export default ConfiguracoesIA;