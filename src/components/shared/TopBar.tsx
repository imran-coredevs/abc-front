import Logo from '@/assets/icon/full-logo.svg?react'
import { useLoginUserStore } from '@/store'
import { Element3, Clock, LogoutCurve, Setting2, Activity } from 'iconsax-reactjs'
import { MenuIcon } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import AlertModal from '../ui/alert-modal'
import ImageWrapper from '../ui/ImageWrapper'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet'
import NavButton from './NavButton'
import Profile from './Profile'

const navButtons = [
    {
        id: 1,
        name: 'Overview',
        href: '/',
        logo: (isActive: boolean) => <Element3 size={20} variant={isActive ? 'Bold' : 'Linear'} />,
    },
    {
        id: 2,
        name: 'Strategy Management',
        href: '/strategy-management',
        logo: (isActive: boolean) => <Activity size={20} variant={isActive ? 'Bold' : 'Linear'} />,
    },
    {
        id: 3,
        name: 'History',
        href: '/history',
        logo: (isActive: boolean) => <Clock size={20} variant={isActive ? 'Bold' : 'Linear'} />,
    },
]

const settingsButton = {
    id: 4,
    name: 'Settings',
    href: '/settings',
    logo: (isActive: boolean) => <Setting2 size={20} variant={isActive ? 'Bold' : 'Linear'} />,
}

export default function TopBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const { user, clear } = useLoginUserStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        clear()
        toast.success('Logged out successfully')
        setIsOpen(false)
        setShowLogoutConfirm(false)
        navigate('/login')
    }

    const openLogoutConfirm = () => {
        setShowLogoutConfirm(true)
    }

    const closeLogoutConfirm = () => {
        setShowLogoutConfirm(false)
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[99] flex w-full items-center justify-between border-b border-neutral-600 bg-white/8 px-4 py-3 sm:p-6 sm:pb-3 backdrop-blur-3xl">
                <Logo onClick={() => navigate('/')} />
                
                {/* Desktop Navigation */}
                <div className="hidden items-center gap-3 lg:flex bg-neutral-950 px-3 py-2 rounded-full">
                    {navButtons.map((button) => (
                        <NavButton key={button.id} button={button} />
                    ))}
                </div>
                <div className="hidden items-center gap-5 lg:flex">
                    <NavButton className="px-3" button={{ ...settingsButton, name: '' }} />
                    <Profile />
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <button className="rounded-full bg-white/8 p-2 hover:bg-white/12 transition-colors">
                                <MenuIcon size={20} className="text-neutral-300" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col pt-20">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">
                                Access navigation links and account options
                            </SheetDescription>
                            {/* Profile Section at Top */}
                            {/* <div className="flex items-center gap-3 pt-4 pb-6 border-b border-neutral-700">
                                <ImageWrapper
                                    src={user?.profileImage}
                                    alt={`Avatar of ${user?.firstName}-${user?.lastName}`}
                                    className="size-12 overflow-hidden rounded-full"
                                    avatar
                                />
                                <div className="flex flex-col">
                                    <h3 className="text-base font-semibold text-neutral-50">
                                        {user?.firstName} {user?.lastName}
                                    </h3>
                                    <p className="text-sm text-neutral-400">{user?.email}</p>
                                </div>
                            </div> */}

                            {/* Navigation Menu */}
                            <nav className="flex-1 flex flex-col gap-2 py-6" aria-label="Mobile navigation menu">
                                {navButtons.map((button) => (
                                    <div key={button.id} onClick={() => setIsOpen(false)}>
                                        <NavButton button={button} />
                                    </div>
                                ))}
                                <div onClick={() => setIsOpen(false)}>
                                    <NavButton button={settingsButton} />
                                </div>
                            </nav>

                            {/* Logout Button at Bottom */}
                            <div className="pt-4 pb-2 border-t border-neutral-700">
                                <button
                                    onClick={openLogoutConfirm}
                                    className="flex w-full items-center justify-center gap-3 rounded-full bg-white/8 px-5 py-3 text-neutral-50 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                                >
                                    <LogoutCurve variant="Bold" size={20} />
                                    <span className="font-medium">Log Out</span>
                                </button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <AlertModal
                isOpen={showLogoutConfirm}
                onClose={closeLogoutConfirm}
                title="Are you sure you want to log out?"
                description="You'll be logged out of your admin dashboard and will need to sign in again to access your account."
                acceptBtnText="Log Out"
                declineBtnText="Cancel"
                onAccept={handleLogout}
                onDecline={closeLogoutConfirm}
            />
        </>
    )
}
