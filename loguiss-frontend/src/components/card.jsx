import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './button';

export function Card({
    children,
    icon,
    desc,
    onEdit,
    onDelete,
    showActions = true
}) {
    return (
        <div className="rounded-lg border border-[#292929] border-l-4 border-l-[#A3E635] bg-[#1B1B1B] p-5 transition-colors hover:border-[#404040] hover:border-l-[#BEF264]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#F5F5F5]">
                    {desc}
                </h2>
                {icon}
            </div>
            {children}
            {showActions && (
                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        type="button"
                        className="mt-2 justify-center bg-[#A3E635] p-3 text-[#111111] hover:bg-[#BEF264]"
                        onClick={onEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        className="mt-2 justify-center bg-red-600 p-3 hover:bg-red-700"
                        onClick={onDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
