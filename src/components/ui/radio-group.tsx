import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '@/lib/utils'

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid gap-3', className)} {...props} />
}

function RadioGroupItem({
    className,
    label,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { label: string }) {
    return (
        <label className="flex cursor-pointer items-center space-x-2">
            <RadioGroupPrimitive.Item
                data-slot="radio-group-item"
                className={cn(
                    'dark:bg-input/30 aspect-square size-6 shrink-0 rounded-full border border-orange-500 text-neutral-900 shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40',
                    className,
                )}
                {...props}
            >
                <RadioGroupPrimitive.Indicator
                    data-slot="radio-group-indicator"
                    className="relative flex items-center justify-center"
                >
                    <div className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-none bg-orange-500 outline-none" />
                </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>

            <span className="p-lg text-neutral-900 select-none">{label}</span>
        </label>
    )
}

export { RadioGroup, RadioGroupItem }
