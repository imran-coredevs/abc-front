import BlueShadow from '@/assets/images/blueshadow.svg'
import { clsx } from 'clsx'
import React from 'react'
import { Link, useLocation } from 'react-router'
import { twMerge } from 'tailwind-merge'

type Props = {
    button: {
        id: number
        name: string
        href: string
        logo: (isActive: boolean) => React.ReactNode
    }
    className?: string
}

const NavButton = ({ button, className }: Props) => {
    const location = useLocation()
    const isRoot = button.href === '/'
    const isActive = location.pathname === button.href || (isRoot && location.pathname === '/')
    const [isHover, setIsHover] = React.useState(false)

    const baseClasses = `relative flex items-center gap-2 rounded-[40px] border border-transparent px-6 py-3 text-base leading-[21px] font-normal transition-[background-color,color,border-color] duration-300 ease-out overflow-hidden`
    const activeClasses = `bg-[#1a1d22] text-[#f6f7f9] border-white/30`
    const hoverClasses = `bg-[#0f1115] text-[#d4d6db]`
    const inactiveClasses = `bg-transparent text-[#b5b8bf]`

    const combinedClasses = twMerge(
        clsx(baseClasses, isActive ? activeClasses : isHover ? hoverClasses : inactiveClasses, className),
    )

    return (
        <Link
            to={button.href}
            className={combinedClasses}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {(isActive || isHover) && (
                <div className="pointer-events-none absolute -right-px -bottom-4.25 z-0 size-18">
                    <div className="absolute inset-[-77%]">
                        <img alt="" className="block size-full max-w-none" src={BlueShadow} />
                    </div>
                </div>
            )}
            <span className="relative z-10 flex items-center gap-2">
                {button.logo(isActive)}
                {button.name}
            </span>
        </Link>
    )
}

export default NavButton
