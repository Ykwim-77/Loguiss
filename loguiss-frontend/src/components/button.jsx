import { cn } from '../utils/cn';

const variantes = {
    primary: 'bg-primaria text-sobre-primaria hover:bg-primaria-hover',
    secondary: 'border border-borda bg-transparent text-texto hover:bg-elevada',
    danger: 'bg-perigo text-white hover:bg-perigo-hover',
    link: 'bg-transparent font-normal text-texto-suave hover:text-primaria hover:underline',
};

const tamanhos = {
    md: 'p-3',
    sm: 'px-3 py-2 text-sm',
    icon: 'p-3',
};

export function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading}
            className={cn(
                'cursor-pointer rounded-lg font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria disabled:cursor-not-allowed disabled:opacity-50',
                variantes[variant],
                tamanhos[size],
                className
            )}
            {...props}
        >
            {loading ? 'Aguarde...' : children}
        </button>
    );
}