import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-[1.875rem] border px-2 py-0.5 overline-1 font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0.1875rem] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
    {
        variants: {
            variant: {
                success: 'border-transparent bg-green-50 text-green-400 [a&]:hover:bg-green-100/50',
                warning: 'border-transparent bg-yellow-50 text-yellow-300 [a&]:hover:bg-yellow-100/90',
                danger: 'border-transparent bg-red-50 text-red-500 [a&]:hover:bg-red-100/90',
                outline: 'border-transparent text-neutral-300 [a&]:hover:bg-neutral-100 [a&]:hover:text-neutral-900',
                cold: 'border-transparent text-neutral-600 bg-neutral-50 [a&]:hover:bg-neutral-100 [a&]:hover:text-neutral-900/50',
            },
        },
        defaultVariants: {
            variant: 'success',
        },
    },
)

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span'

    return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
