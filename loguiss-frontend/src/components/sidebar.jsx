import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { menuItems as menuList } from '../utils/menuItems';
import { cn } from '../utils/cn';

const baseItem =
    'flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all';

function MenuItem({ item, onNavigate }) {
    const Icon = item.icon;
    const hasSubmenu = item.subMenu?.length > 0;

    const [hover, setHover] = useState(false);
    const [fixo, setFixo] = useState(false);
    const raiz = useRef(null);

    const aberto = hover || fixo;

    const fechar = useCallback(() => {
        setHover(false);
        setFixo(false);
    }, []);

    // fecha ao clicar fora ou apertar Esc (só enquanto estiver aberto)
    useEffect(() => {
        if (!aberto) return;

        const aoClicarFora = (e) => {
            if (raiz.current && !raiz.current.contains(e.target)) fechar();
        };
        const aoApertarTecla = (e) => {
            if (e.key === 'Escape') fechar();
        };

        document.addEventListener('mousedown', aoClicarFora);
        document.addEventListener('keydown', aoApertarTecla);
        return () => {
            document.removeEventListener('mousedown', aoClicarFora);
            document.removeEventListener('keydown', aoApertarTecla);
        };
    }, [aberto, fechar]);

    // ao navegar por um link do submenu, fecha este nível e avisa o pai
    const aoNavegar = () => {
        fechar();
        onNavigate?.();
    };

    return (
        <div
            ref={raiz}
            className="relative"
            onMouseEnter={() => hasSubmenu && setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {hasSubmenu ? (
                <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={aberto}
                    onClick={() => setFixo((v) => !v)}
                    className={cn(
                        baseItem,
                        'text-left',
                        aberto
                            ? 'bg-elevada text-primaria'
                            : 'text-texto-suave hover:bg-elevada hover:text-primaria'
                    )}
                >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                    <ChevronRight size={16} className="ml-auto" />
                </button>
            ) : (
                <NavLink
                    to={item.href}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        cn(
                            baseItem,
                            isActive
                                ? 'bg-primaria text-sobre-primaria shadow-sm shadow-primaria/10'
                                : 'text-texto-suave hover:bg-elevada hover:text-primaria'
                        )
                    }
                >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                </NavLink>
            )}

            {hasSubmenu && aberto && (
                <div
                    role="menu"
                    className="absolute left-full top-0 z-50 w-56 rounded-lg border border-borda bg-superficie p-2 shadow-xl shadow-black/40"
                >
                    {item.subMenu.map((subItem) => (
                        <MenuItem key={subItem.label} item={subItem} onNavigate={aoNavegar} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function SideBar({ menuItems = menuList }) {
    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-borda bg-fundo px-5 py-6">
            <div className="mb-8 flex items-center gap-4">
                <img
                    src="/images/logo.png"
                    alt="Logo da Loguiss"
                    className="h-20 w-20 rounded-lg"
                />
                <span className="text-xl font-bold text-texto">Loguiss</span>
            </div>

            <nav className="flex flex-1 flex-col gap-2">
                {menuItems.map((item) => (
                    <MenuItem key={item.label} item={item} />
                ))}
            </nav>
        </aside>
    );
}