import { Chart, Setting2, Task } from 'iconsax-reactjs'
import { NavLink } from 'react-router-dom'

const navItems = [
    {
        title: 'General',
        items: [
            { name: 'Overview', icon: <Chart />, href: '/' },
            { name: 'Strategy Management', icon: <Task />, href: '/strategy-management' },
            { name: 'History', icon: <Chart />, href: '/history' },
        ],
    },
    { title: 'Settings', items: [{ name: 'Settings', icon: <Setting2 />, href: '/settings' }] },
]

export default function Sidebar() {
    return (
        <aside className="bg-white-50 flex h-screen w-[270px] flex-col border-r border-r-neutral-100">
            <div className="from-white-50/0 flex-1 bg-gradient-to-b to-orange-200/16 px-4 py-6">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4">
                        {navItems.map((nav, idx) => (
                            <nav key={idx} className="flex flex-col gap-4">
                                <ul className="flex flex-col gap-2">
                                    {nav.items.map(({ name, icon, href }) => (
                                        <li key={href}>
                                            <NavLink
                                                to={href}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2 rounded-lg p-3 transition-transform duration-500 will-change-transform ${isActive ? 'bg-orange-500 text-white' : 'text-neutral-800 hover:scale-[102%] hover:text-neutral-800/80'}`
                                                }
                                            >
                                                {icon}
                                                {name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    )
}
