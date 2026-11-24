import { useState } from 'react';
import { toast } from 'sonner';

import {
    ChartBarDecreasing,
    Save,
    RotateCcw,
    CalendarDays,
    RefreshCw,
} from 'lucide-react';

import { SideBar } from '../components/sidebar';
import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { Secao } from '../components/secao';

const dadosIniciais = {
    dias: '30',
    tempoAtualizacao: '15'
};

const campos = [
    {
        id: 'dias',
        label: 'Dias de previsão',
        icone: CalendarDays,
        tipo: 'number',
    },
    {
        id: 'tempoAtualizacao',
        label: 'Intervalo de atualização',
        icone: RefreshCw,
        tipo: 'select',
        options: [
            { value: '5', label: 'A cada 5 minutos' },
            { value: '15', label: 'A cada 15 minutos' },
            { value: '30', label: 'A cada 30 minutos' },
            { value: '60', label: 'A cada 1 hora' },
        ],
    },
];

const soDigitos = (valor) => valor.replace(/\D/g, '');

function validarIA(IA) {
    const dias = String(IA.dias).trim();

    return {
        dias: !dias
            ? 'O campo é obrigatório'
            : Number(dias) < 1 || Number(dias) > 365
                ? 'Informe um período entre 1 e 365 dias'
                : '',

        tempoAtualizacao: !IA.tempoAtualizacao
            ? 'Selecione um intervalo de atualização'
            : '',
    };
}

function ConfiguracoesIA() {
    const [IA, setIA] = useState(dadosIniciais);
    const [dadosSalvos, setDadosSalvos] = useState(dadosIniciais);
    const [tentouSalvar, setTentouSalvar] = useState(false);

    const salvo = JSON.stringify(IA) === JSON.stringify(dadosSalvos);
    const erros = validarIA(IA);

    const alterarCampo = (id, valor) => {
        setIA((atual) => ({
            ...atual,
            [id]: valor,
        }));
    };

    function salvarAlteracoes(event) {
        event.preventDefault();
        setTentouSalvar(true);

        if (Object.values(erros).some(Boolean)) {
            toast.error('Corrija os campos destacados.');
            return;
        }

        setDadosSalvos({ ...IA });
        setTentouSalvar(false);

        toast.success('Configurações de IA salvas com sucesso!');
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
                    <h1 className="text-3xl font-bold text-[var(--text)]">
                        Configurações de IA
                    </h1>

                    <p className="mt-1 text-[var(--text-secondary)]">
                        Personalize os parâmetros utilizados pela inteligência artificial
                        para gerar previsões e analisar os dados do seu estoque.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <Secao
                        icone={ChartBarDecreasing}
                        titulo="Margem de previsão"
                        descricao="Defina quantos dias de previsão deseja visualizar nos gráficos e análises."
                    >
                        <form onSubmit={salvarAlteracoes} className="mt-6 space-y-4">
                            {campos.map(({ id, label, icone, tipo }) => (
                                <Inputs
                                    key={id}
                                    id={id}
                                    label={label}
                                    type={tipo}
                                    icon={icone}
                                    min="1"
                                    max="365"
                                    step="1"
                                    value={IA[id]}
                                    onChange={(e) =>
                                        alterarCampo(id, soDigitos(e.target.value))
                                    }
                                    error={erros[id]}
                                    touched={tentouSalvar}
                                />
                            ))}

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                                <span className="text-xs text-[var(--text-secondary)]">
                                    {salvo
                                        ? 'Dados atualizados'
                                        : 'Alterações não salvas'}
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
                        icone={RefreshCw}
                        titulo="Atualização de dados"
                        descricao="Defina a frequência com que os dados utilizados pela inteligência artificial devem ser atualizados."
                    >
                        <form onSubmit={salvarAlteracoes} className="mt-6 space-y-4">
                            <Inputs
                                id="tempoAtualizacao"
                                label="Tempo de atualização"
                                type="select"
                                icon={RefreshCw}
                                options={[
                                    { value: '5', label: 'A cada 5 minutos' },
                                    { value: '15', label: 'A cada 15 minutos' },
                                    { value: '30', label: 'A cada 30 minutos' },
                                    { value: '60', label: 'A cada 1 hora' },
                                ]}
                                value={IA.tempoAtualizacao}
                                onChange={(e) =>
                                    alterarCampo('tempoAtualizacao', e.target.value)
                                }
                                error={erros.tempoAtualizacao}
                                touched={tentouSalvar}
                            />

                            <p className="text-xs text-[var(--text-secondary)]">
                                Intervalos menores podem aumentar a frequência de processamento dos dados.
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
                </div>
            </main>
        </div>
    );
}

export default ConfiguracoesIA;
