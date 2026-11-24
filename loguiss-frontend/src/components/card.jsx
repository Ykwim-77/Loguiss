import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '../utils/cn';

function CardBase({ children, className }) {
    return (
        <div
            className={cn(
                'rounded-lg border border-borda border-l-4 border-l-primaria bg-superficie p-5 transition-colors hover:border-l-primaria-hover',
                className
            )}
        >
            {children}
        </div>
    );
}

export function StatCard({ titulo, valor, icone: Icon }) {
    return (
        <CardBase>
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-texto">{titulo}</h2>
                {Icon && <Icon size={24} className="text-primaria" />}
            </div>
            <p className="mt-5 text-3xl font-bold text-texto">{valor}</p>
        </CardBase>
    );
}

export function EntityCard({ titulo, icone: Icon, onEdit, onDelete, children }) {
    return (
        <CardBase>
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-texto">{titulo}</h2>
                {Icon && <Icon className="h-6 w-6 text-texto-suave" />}
            </div>

            {children}

            <div className="mt-4 flex justify-end gap-3">
                <Button variant="primary" size="icon" aria-label={`Editar ${titulo}`} onClick={onEdit}>
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="danger" size="icon" aria-label={`Excluir ${titulo}`} onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </CardBase>
    );
}

export function CustomCard({ children, className }) {
    return (
        <CardBase className={className}>
            {children}
        </CardBase>
    );
}