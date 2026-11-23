import { cn } from '../utils/cn';

export function Secao({ icone: Icon, titulo, descricao, className = '', children }) {
    return (
        <section className={cn('rounded-xl border border-[#292929] bg-[#1B1B1B] p-5', className)}>
            <div className="flex items-center gap-4">
                <Icon size={20} />
                <div>
                    <h2 className="text-xl font-bold text-[#F5F5F5]">{titulo}</h2>
                    <p className="mt-1 text-sm text-[#A3A3A3]">{descricao}</p>
                </div>
            </div>
            {children}
        </section>
    );
}