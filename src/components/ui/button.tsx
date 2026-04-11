import RoundedWhiteShadow from '@/assets/images/rounded-white-shadow.svg'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[40px] text-base leading-[21px] font-normal transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    'text-[#f6f7f9] hover:opacity-90 active:opacity-80 disabled:text-white cursor-pointer relative before:absolute before:inset-0 before:rounded-[40px] before:p-[1px] before:bg-gradient-to-b before:from-white/50 before:to-white/20 before:-z-10 after:absolute after:inset-[1px] after:rounded-[39px] after:bg-gradient-to-b after:from-[#2c1082] after:to-[#5224e2] after:-z-10 hover:after:from-[#3818a0] hover:after:to-[#6237f0] active:after:from-[#240d6b] active:after:to-[#4519d4] disabled:after:from-neutral-600 disabled:after:to-neutral-600',

                secondary:
                    'bg-neutral-800 text-neutral-50 hover:bg-neutral-900 border border-neutral-700/0 hover:border-neutral-700 disabled:bg-neutral-600 disabled:text-white transition-all duration-300 cursor-pointer',

                link: 'bg-transparent underline-offset-4 hover:underline text-neutral-50 hover:text-lime-green-500 disabled:text-neutral-500 transition-all duration-300 cursor-pointer',
            },
            size: {
                default: 'px-6 py-3 has-[>svg]:px-6',
                sm: 'px-4 py-2 rounded-full gap-1.5 has-[>svg]:px-3',
                lg: 'px-8 py-4 rounded-[40px] has-[>svg]:px-6',
                icon: 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

function Button({
    className,
    variant,
    size,
    asChild = false,
    children,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : 'button'

    return (
        <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
            {variant === 'default' && (
                <div className="pointer-events-none absolute top-[calc(50%+54.5px)] left-1/2 size-20 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-[-70%]">
                        <img alt="" className="block size-full max-w-none" src={RoundedWhiteShadow} />
                    </div>
                </div>
            )}
            <span className="relative z-10">{children}</span>
        </Comp>
    )
}

export { Button, buttonVariants }
