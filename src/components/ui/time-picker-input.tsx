import { Controller, Control, FieldValues, Path } from 'react-hook-form'
import { Clock } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'

type Props<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
    disabled?: boolean | string
    step?: number
    placeholderText?: string
    className?: string
}

export function TimePickerInput<T extends FieldValues>({
    control,
    name,
    disabled = false,
    step = 60,
    placeholderText,
    className,
}: Props<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                if (field.disabled) {
                    return (
                        <div
                            className={cn(
                                'relative flex w-full min-w-40 cursor-not-allowed items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-neutral-100',
                                className,
                            )}
                        >
                            <span className="truncate">{placeholderText || field.value || 'N/A'}</span>
                            <Clock className="text-neutral-100" />
                        </div>
                    )
                }

                return (
                    <div className={cn('relative w-full min-w-40', className)}>
                        <input
                            {...field}
                            type="time"
                            step={step}
                            disabled={typeof disabled === 'string' ? (disabled === 'ture' ? true : false) : disabled}
                            className="w-full appearance-none rounded-lg border border-neutral-200 px-3 py-2 text-neutral-700 outline-none focus:text-neutral-900 disabled:border-neutral-100 disabled:text-neutral-100 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />

                        <Clock
                            className={cn(
                                'absolute top-1/2 right-2 -translate-y-1/2',
                                disabled ? 'text-neutral-100' : 'text-neutral-500',
                            )}
                        />
                    </div>
                )
            }}
        />
    )
}
