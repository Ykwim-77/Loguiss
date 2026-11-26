import { Eye, EyeClosed } from 'lucide-react';

import { cn } from '../utils/cn';

export function ButtonEye({ isOpen = false, onToggle, size = 20, className = '', ...props }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={isOpen ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={isOpen}
            className={cn(
                'text-texto-suave transition-colors hover:text-texto focus:outline-none',
                className,
            )}
            {...props}
        >
            {isOpen ? <EyeClosed size={size} /> : <Eye size={size} />}
        </button>
    );
}
