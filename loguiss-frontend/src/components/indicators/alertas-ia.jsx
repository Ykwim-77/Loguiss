import { AlertCircle, AlertTriangle, Bell, Info, X } from 'lucide-react';
import { useState } from 'react';

import { alertasPadrao } from '../../data/dashboardData';

const estilosSeveridade = {
    urgente: {
        card: 'border-perigo/30 bg-perigo/10',
        iconeBg: 'border-perigo/40 bg-perigo/15 text-perigo-texto',
        badge: 'border-perigo/40 bg-perigo/15 text-perigo-texto',
        label: 'Urgente',
        Icon: AlertCircle,
    },
    atencao: {
        card: 'border-aviso/30 bg-aviso/10',
        iconeBg: 'border-aviso/40 bg-aviso/15 text-aviso-texto',
        badge: 'border-aviso/40 bg-aviso/15 text-aviso-texto',
        label: 'Atenção',
        Icon: AlertTriangle,
    },
    informativo: {
        card: 'border-sucesso/30 bg-sucesso/10',
        iconeBg: 'border-sucesso/40 bg-sucesso/15 text-sucesso-texto',
        badge: 'border-sucesso/40 bg-sucesso/15 text-sucesso-texto',
        label: 'Informativo',
        Icon: Info,
    },
};

export function AlertasIA({
    titulo = 'Alertas',
    descricao = 'Pontos para revisar antes da próxima reposição',
    dados = alertasPadrao,
    onVerProjecao,
}) {
    const [dispensados, setDispensados] = useState([]);

    const alertasVisiveis = dados.filter((alerta) => !dispensados.includes(alerta.id));
    const totalUrgentes = alertasVisiveis.filter(
        (alerta) => alerta.severidade === 'urgente',
    ).length;

    const dispensarAlerta = (id) => {
        setDispensados((prev) => [...prev, id]);
    };

    return (
        <div className="mt-4 w-full min-w-0 rounded-xl border border-borda bg-superficie p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primaria/10">
                        <Bell size={20} className="text-primaria" />
                        {alertasVisiveis.length > 0 && (
                            <span className=" -top-1 -right-1 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-primaria px-1 text-[10px] font-bold text-sobre-primaria">
                                {alertasVisiveis.length}
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-texto">{titulo}</h2>
                        <p className="text-xs text-texto-suave">{descricao}</p>
                    </div>
                </div>
                {totalUrgentes > 0 && (
                    <span className="shrink-0 rounded-full border border-perigo/40 bg-perigo/15 px-2.5 py-1 text-xs font-semibold text-perigo-texto">
                        {totalUrgentes} {totalUrgentes === 1 ? 'urgente' : 'urgentes'}
                    </span>
                )}
            </div>
            <div className="mt-5 flex flex-col gap-3.5">
                {alertasVisiveis.length === 0 ? (
                    <div className="rounded-xl border border-borda bg-fundo px-4 py-8 text-center text-xs text-texto-suave">
                        Nenhum alerta ativo no momento.
                    </div>
                ) : (
                    alertasVisiveis.map((alerta) => {
                        const tema =
                            estilosSeveridade[alerta.severidade] || estilosSeveridade.informativo;
                        const IconeAlerta = tema.Icon;

                        return (
                            <div
                                key={alerta.id}
                                className={`rounded-xl border p-4 transition-colors ${tema.card}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${tema.iconeBg}`}
                                    >
                                        <IconeAlerta size={16} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-sm font-bold text-texto">
                                                    {alerta.titulo}
                                                </h3>
                                                <span
                                                    className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tema.badge}`}
                                                >
                                                    {alerta.badgeLabel || tema.label}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => dispensarAlerta(alerta.id)}
                                                aria-label="Fechar alerta"
                                                className="rounded-md p-1 text-texto-suave transition-colors hover:bg-texto/10 hover:text-texto cursor-pointer"
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>
                                        <p className="mt-1.5 text-xs leading-relaxed text-texto">
                                            {alerta.descricao}
                                        </p>
                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                            <span className="text-texto-suave">
                                                {alerta.tempo} · {alerta.codigo}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
