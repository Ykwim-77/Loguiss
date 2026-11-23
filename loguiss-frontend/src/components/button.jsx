import { cn } from '../utils/cn';

const variantes = {
    primary: 'bg-[#4EDB4E] hover:bg-[#3CB43C]',
    secondary: 'bg-gray-700 hover:bg-gray-600',
    danger: 'bg-red-600 hover:bg-red-700',
    link: 'bg-transparent font-normal text-gray-400 hover:text-green-500 hover:underline',
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
                'cursor-pointer rounded-lg font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50',
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