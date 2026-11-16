
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
                <div
                    className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-[#A3A3A3] transition-all hover:bg-[#292929] hover:text-[#A3E635]"
                >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                    <span className="ml-auto text-xl text-[#737373]">›</span>
                </div>
            ) : (
                <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                        `flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                            isActive
                                ? 'bg-[#A3E635] text-[#111111] shadow-sm shadow-[#A3E635]/10'
                                : 'text-[#A3A3A3] hover:bg-[#292929] hover:text-[#A3E635]'
                        }`
                    }
                >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                </NavLink>
            )}

            {hasSubmenu && (
                <div
                    className={`absolute left-full top-0 z-50 hidden w-56 rounded-lg border border-[#343434] bg-[#1B1B1B] p-2 shadow-xl shadow-black/40 ${hoverClass}`}
                >
                    {item.subMenu.map((subItem) => (
                        <MenuItem
                            key={subItem.label}
                            item={subItem}
                            nested
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function SideBar({ menuItems = menuList }) {
    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#292929] bg-[#111111] px-5 py-6">

            <div className="mb-8 flex items-center gap-4">
                <img
                    src="/images/logo.png"
                    alt="Logo da Loguiss"
                    className="h-20 w-20 rounded-lg"
                />
                <span className="text-xl font-bold text-[#F5F5F5]">
                    Loguiss
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-2">
                {menuItems.map((item) => (
                    <MenuItem key={item.label} item={item} />
                ))}
            </nav>

        </aside>
    );
}
