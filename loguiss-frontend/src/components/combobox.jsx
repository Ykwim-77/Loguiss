import { useState, useRef, useEffect } from 'react';
import { Inputs } from './inputs';
import { cn } from '../utils/cn';

export function Combobox({
    label,
    value,
    opcoes = [],
    getLabel,
    getChave,
    onChange,   // recebe o texto digitado
    onSelect,   // recebe a opção escolhida
    placeholder,
    className = '',
    ...props
}) {
    const [aberto, setAberto] = useState(false);
    const raiz = useRef(null);

    useEffect(() => {
        const fecharFora = (e) => {
            if (raiz.current && !raiz.current.contains(e.target)) setAberto(false);
        };
        document.addEventListener('mousedown', fecharFora);
        return () => document.removeEventListener('mousedown', fecharFora);
    }, []);

    const termo = (value ?? '').toLowerCase();
    const filtradas = opcoes.filter((o) => getLabel(o).toLowerCase().includes(termo));

    return (
        <div ref={raiz} className={cn('relative min-w-0', className)}>
            <Inputs
                label={label}
                value={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => {
                    setAberto(true);
                    onChange(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') setAberto(false);
                }}
                {...props}
            />

            {aberto && value && (
                <ul className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-borda bg-superficie shadow-lg">
                    {filtradas.length === 0 ? (
                        <li className="px-3 py-2 text-sm text-texto-suave">Nenhum resultado</li>
                    ) : (
                        filtradas.map((opcao) => (
                            <li key={getChave(opcao)}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect(opcao);
                                        setAberto(false);
                                    }}
                                    className="block w-full px-3 py-2 text-left text-texto hover:bg-elevada"
                                >
                                    {getLabel(opcao)}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}