import { useId } from 'react';
import { cn } from '../utils/cn';

export function Inputs({
    label,
    type = 'text',
    icon: Icon,
    rightElement,
    options = [],
    error,
    touched = false,
    className = '',
    inputClassName = '',
    id,
    ...props
}) {
    const autoId = useId();
    const campoId = id ?? autoId;
    const erroId = `${campoId}-erro`;
    const mostrarErro = touched && Boolean(error);

    const comum = {
        id: campoId,
        'aria-invalid': mostrarErro,
        'aria-describedby': mostrarErro ? erroId : undefined,
    };

    return (
        <div className={cn('w-full', className)}>
            {label && (
                <label htmlFor={campoId} className="mb-1 block text-sm font-medium text-texto">
                    {label}
                </label>
            )}

            <div
                className={cn(
                    'flex items-center gap-3 rounded-lg border bg-fundo p-3 focus-within:border-primaria has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70',
                    mostrarErro ? 'border-perigo' : 'border-borda'
                )}
            >
                {Icon && <Icon size={20} className="text-texto-suave" />}

                {type === 'select' ? (
                    <select
                        {...comum}
                        {...props}
                        className="w-full bg-transparent text-texto outline-none [&>option]:bg-superficie"
                    >
                        {options.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        {...comum}
                        type={type}
                        {...props}
                        className="w-full bg-transparent text-texto outline-none placeholder:text-texto-suave"
                    />
                )}

                {rightElement}
            </div>

            {mostrarErro && (
                <p id={erroId} role="alert" className="mt-1 text-sm text-perigo-texto">
                    {error}
                </p>
            )}
        </div>
    );
}