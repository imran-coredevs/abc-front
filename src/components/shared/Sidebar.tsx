import Logo from '@/assets/images/logo.svg?react'
import { useLoginUserStore } from '@/store'
import { defaultAvatar } from '@/utils/constant'
import { Chart, More, Setting2, Task } from 'iconsax-reactjs'
import { NavLink } from 'react-router-dom'
import ImageWrapper from '../ui/ImageWrapper'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import Seperator from '../ui/Separator'

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
    const { user, clear } = useLoginUserStore()

    const handleLogout = () => {
        clear()
        window.location.href = '/login'
    }

    return (
        <aside className="bg-white-50 flex h-screen w-[270px] flex-col border-r border-r-neutral-100">
            <div className="border-b border-b-neutral-100 lg:block hidden">
                <div className="p-6">
                    <Logo />
                </div>
            </div>

            <div className="from-white-50/0 flex-1 bg-gradient-to-b to-orange-200/16 px-4 py-6">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between gap-4 lg:flex hidden">
                        <div className="flex items-center gap-2">
                            <div className="flex size-[46px] items-center justify-center rounded-full bg-[#C4CCE4] p-1">
                                <ImageWrapper
                                    src={user?.profileImage || defaultAvatar}
                                    alt={`Avatar of ${user?.firstName}-${user?.lastName}`}
                                    className="h-full w-full overflow-clip rounded-full"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="p-md font-medium">{`${user?.firstName} ${user?.lastName}`}</span>
                                <span className="overline-1 text-neutral-500">{user?.role}</span>
                            </div>
                        </div>

                        <Popover>
                            <PopoverTrigger className="cursor-pointer">
                                <More className="pi pi-ellipsis-h text-neutral-500" />
                            </PopoverTrigger>
                            <PopoverContent className="w-fit cursor-pointer border-none" onClick={handleLogout}>
                                Log Out
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Seperator className="lg:block hidden"/>

                    <div className="flex flex-col gap-4">
                        {navItems.map((nav, idx) => (
                            <nav key={idx} className="flex flex-col gap-4">
                                <span className="p-sm text-neutral-400">{nav.title}</span>

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
