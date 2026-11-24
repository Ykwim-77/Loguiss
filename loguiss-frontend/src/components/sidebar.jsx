import { NavLink } from 'react-router-dom';
import { menuItems as menuList } from '../utils/menuItems';

function MenuItem({ item, nested = false }) {
    const Icon = item.icon;
    const hasSubmenu = item.subMenu?.length > 0;

    const groupClass = nested ? 'group/submenu' : 'group/root';
    const hoverClass = nested ? 'group-hover/submenu:block' : 'group-hover/root:block';

    return (
        <div className={`relative ${groupClass}`}>
            {hasSubmenu ? (
                <div className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-texto-suave transition-all hover:bg-elevada hover:text-primaria">
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                    <span className="ml-auto text-xl text-texto-suave">›</span>
                </div>
            ) : (
                <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                        `flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                            isActive
                                ? 'bg-primaria text-sobre-primaria shadow-sm shadow-primaria/10'
                                : 'text-texto-suave hover:bg-elevada hover:text-primaria'
                        }`
                    }
                >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                </NavLink>
            )}

            {hasSubmenu && (
                <div
                    className={`absolute left-full top-0 z-50 hidden w-56 rounded-lg border border-borda bg-superficie p-2 shadow-xl shadow-black/40 ${hoverClass}`}
                >
                    {item.subMenu.map((subItem) => (
                        <MenuItem key={subItem.label} item={subItem} nested />
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