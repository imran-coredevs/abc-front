import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as React from 'react'

import CheckIcon from '@/assets/icon/check.svg?react'
import { cn } from '@/lib/utils'
import { Control, Controller, FieldValues } from 'react-hook-form'

type Props = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
    control?: Control<FieldValues>
    variant?: 'default' | 'secondary'
    handleChecked?: (val: boolean) => void
}

function CheckboxUi({ className, variant = 'default', ...props }: Props) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'peer border-blue-700 dark:bg-input/30 data-[state=checked]:bg-blue-800 dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-6 shrink-0 cursor-pointer rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-transparent',
                variant === 'secondary' && 'border-neutral-400 data-[state=checked]:bg-neutral-700',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-current transition-none"
            >
                <CheckIcon />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

function Checkbox({ control, handleChecked, ...props }: Props) {
    if (control) {
        return (
            <Controller
                name={props.name || 'checkbox'}
                control={control}
                render={({ field }) => <CheckboxUi checked={field.value} onCheckedChange={field.onChange} />}
                {...props}
            />
        )
    }

    return <CheckboxUi checked={props.checked} onCheckedChange={handleChecked} {...props} />
}

export { Checkbox }
