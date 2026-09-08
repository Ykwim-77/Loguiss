import { Eye, EyeClosed } from 'lucide-react';

export function ButtonEye({
    visualizar_senha,
    setVisualizarSenha,
    className = '',
    ...props
}) {
    return (
        <button
            type="button"
            onClick={() => setVisualizarSenha(!visualizar_senha)}
            className={`text-gray-500 hover:text-gray-700 focus:outline-none ${className}`}
            {...props}
        >
            {visualizar_senha
                ? <EyeClosed size={20} />
                : <Eye size={20} />
            }
        </button>
    );
}