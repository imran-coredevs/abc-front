import { useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar as CalanderIcon } from 'iconsax-reactjs'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

type Props = { name: string; control: Control<FieldValues>; label?: string; required?: boolean; disabled?: boolean }

export default function InputCalander({ name, control, label, required = true, disabled = false }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: `${label || 'Date'} is required` }}
            render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                    {label && (
                        <label
                            className={cn(
                                'p-md font-medium text-neutral-800',
                                disabled && 'cursor-not-allowed opacity-50',
                            )}
                        >
                            {label} {required && '*'}
                        </label>
                    )}

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild className="text-sm">
                            <div
                                id="date-picker"
                                className={cn(
                                    'flex w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-200 p-3',
                                    error && 'border-red-500',
                                    disabled && 'cursor-not-allowed opacity-50',
                                )}
                            >
                                <span className={cn('p-md', field.value ? 'text-neutral-800' : 'text-neutral-400')}>
                                    {field.value ? format(field.value, 'dd/MM/yyyy') : 'DD/MM/YYYY'}
                                </span>
                                <CalanderIcon className="text-neutral-400" variant="Bold" />
                            </div>
                        </PopoverTrigger>

                        {!disabled && (
                            <PopoverContent className="w-auto overflow-hidden border-none p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    className="rounded-md border border-none shadow-sm"
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        )}
                    </Popover>

                    {error && <span className="overline-1 text-red-500">{error?.message}</span>}
                </div>
            )}
        />
    )
}
