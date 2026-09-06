import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './button';

export function Card({ children, icon, desc, onEdit, onDelete }) {
    return (
        <div className="rounded-xl border border-gray-800 border-l-4 border-l-green-500 bg-[#0d0920] p-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    {desc}
                </h2>

                {icon}
            </div>

            {children}

            <div className="mt-4 flex justify-end gap-3">

                <Button
                    type="button"
                    className="mt-2 bg-green-600 p-3 hover:bg-green-700 justify-center"
                    onClick={onEdit}
                >
                    <Pencil className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    className="mt-2 bg-red-600 p-3 hover:bg-red-700 justify-center"
                    onClick={onDelete}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>

            </div>
        </div>
    );
}
