import { Bell, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState } from 'react';
import { alertasPadrao } from '../../data/dashboardData';

const estilosSeveridade = {
    urgente: {
        card: 'border-[#5C2428] bg-[#261517]',
        iconeBg: 'border-[#7F2A30] bg-[#3B171A] text-[#F87171]',
        badge: 'border-[#7F2A30] bg-[#4A1B1E] text-[#FCA5A5]',
        label: 'Urgente',
        Icon: AlertCircle,
    },
    atencao: {
        card: 'border-[#5A4519] bg-[#241E12]',
        iconeBg: 'border-[#7A5C1E] bg-[#382B14] text-[#FACC15]',
        badge: 'border-[#7A5C1E] bg-[#473616] text-[#FDE047]',
        label: 'Atenção',
        Icon: AlertTriangle,
    },
    informativo: {
        card: 'border-[#1E472A] bg-[#122217]',
        iconeBg: 'border-[#275E38] bg-[#173320] text-[#4ADE80]',
        badge: 'border-[#275E38] bg-[#1C4027] text-[#86EFAC]',
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

    const alertasVisiveis = dados.filter(
        (alerta) => !dispensados.includes(alerta.id)
    );
    const totalUrgentes = alertasVisiveis.filter(
        (alerta) => alerta.severidade === 'urgente'
    ).length;

    const dispensarAlerta = (id) => {
        setDispensados((prev) => [...prev, id]);
    };

    return (
        <div className="mt-4 w-full min-w-0 rounded-xl border border-[#292929] bg-[#1B1B1B] p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A3E635]/10">
                        <Bell size={20} className="text-[#A3E635]" />
                        {alertasVisiveis.length > 0 && (
                            <span className=" -top-1 -right-1 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A3E635] px-1 text-[10px] font-bold text-[#111111]">
                                {alertasVisiveis.length}
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-[#F5F5F5]">
                            {titulo}
                        </h2>
                        <p className="text-xs text-[#A3A3A3]">
                            {descricao}
                        </p>
                    </div>
                </div>
                {totalUrgentes > 0 && (
                    <span className="shrink-0 rounded-full border border-[#6E272C] bg-[#3A1619] px-2.5 py-1 text-xs font-semibold text-[#F87171]">
                        {totalUrgentes} {totalUrgentes === 1 ? 'urgente' : 'urgentes'}
                    </span>
                )}
            </div>
            <div className="mt-5 flex flex-col gap-3.5">
                {alertasVisiveis.length === 0 ? (
                    <div className="rounded-xl border border-[#292929] bg-[#161616] px-4 py-8 text-center text-xs text-[#8E8E8E]">
                        Nenhum alerta ativo no momento.
                    </div>
                ) : (
                    alertasVisiveis.map((alerta) => {
                        const tema =
                            estilosSeveridade[alerta.severidade] ||
                            estilosSeveridade.informativo;
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
                                                <h3 className="text-sm font-bold text-[#F5F5F5]">
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
                                                className="rounded-md p-1 text-[#A3A3A3] transition-colors hover:bg-white/10 hover:text-[#F5F5F5] cursor-pointer"
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>
                                        <p className="mt-1.5 text-xs leading-relaxed text-[#D4D4D4]">
                                            {alerta.descricao}
                                        </p>
                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                            <span className="text-[#8E8E8E]">
                                                {alerta.tempo} · {alerta.codigo}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => onVerProjecao?.(alerta)}
                                                className="font-semibold text-[#F5F5F5] transition-colors hover:text-[#A3E635] cursor-pointer"
                                            >
                                                Ver projeção →
                                            </button>
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