import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import Seperator from './Separator'

export type Option = {
    label: string
    value: string
    icon?: React.ReactNode
    variant?: 'success' | 'danger'
}

type Props = React.HTMLAttributes<HTMLDivElement> & {
    control: Control<FieldValues>
    name: string
    label?: string
    options: Option[]
    icon?: React.ReactNode
    iconPosition?: 'before' | 'after'
    placeholder?: string
    required?: boolean
    variant?: 'default' | 'ghost'
    position?: 'center'
    disabled?: boolean
}

export default function SelectInput({ iconPosition = 'before', required, ...props }: Props) {
    const [selected, setSelected] = useState<Option | null>(null)

    return (
        <Controller
            name={props.name}
            control={props.control}
            rules={{ required: required && 'This field is required' }}
            render={({ field, fieldState: { error } }) => {
                const defaultSelected = props.options.find((o) => o.value === field.value)

                return (
                    <div className="flex flex-col gap-2">
                        {props.label && (
                            <label className="p-md text-neutral-800">
                                {props.label} {required && '*'}
                            </label>
                        )}

                        <Select
                            onValueChange={(val) => {
                                field.onChange(val)
                                const found = props.options.find((o) => o.value === val) || null
                                setSelected(found)
                            }}
                            disabled={props.disabled}
                            defaultValue={field.value}
                        >
                            <SelectTrigger
                                className={cn(
                                    'w-36',
                                    props.variant === 'ghost' && 'border border-neutral-100 bg-transparent',
                                    props.className,
                                )}
                            >
                                <div
                                    className={cn(
                                        'inline-flex w-full gap-2',
                                        props.position === 'center' && 'items-center justify-center text-center',
                                    )}
                                >
                                    {iconPosition === 'before' && (selected?.icon ?? props.icon)}

                                    <span
                                        className={cn(
                                            'text-neutral-900',

                                            (selected?.variant === 'success' ||
                                                defaultSelected?.variant === 'success' ||
                                                props.options[0].variant === 'success') &&
                                                'text-green-500',

                                            (selected?.variant === 'danger' ||
                                                defaultSelected?.variant === 'danger' ||
                                                props.options[0].variant === 'danger') &&
                                                'text-red-500',
                                        )}
                                    >
                                        {defaultSelected?.label ||
                                            selected?.label ||
                                            props.placeholder ||
                                            props.options[0].label}
                                    </span>

                                    {iconPosition === 'after' && (selected?.icon ?? props.icon)}
                                </div>
                            </SelectTrigger>

                            <SelectContent className={cn(props.variant === 'ghost' && 'border border-neutral-100')}>
                                {props.options.map((option, index) => (
                                    <div key={index} className="flex w-full flex-col justify-between">
                                        <SelectItem
                                            value={option.value}
                                            className={cn(
                                                props.position === 'center' &&
                                                    'items-center justify-center text-center',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'flex gap-2',
                                                    option?.variant
                                                        ? option?.variant === 'success'
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                        : (option.value === defaultSelected?.value ||
                                                              option.value === selected?.value) &&
                                                              'text-orange-500',
                                                )}
                                            >
                                                {option.icon && <span>{option.icon}</span>}
                                                {option.label}
                                            </span>
                                        </SelectItem>

                                        {index !== props.options.length - 1 && <Seperator />}
                                    </div>
                                ))}
                            </SelectContent>

                            {error && <span className="overline-1 text-red-500">{error.message}</span>}
                        </Select>
                    </div>
                )
            }}
        />
    )
}
