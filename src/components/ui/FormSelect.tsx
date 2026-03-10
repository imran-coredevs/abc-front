import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from 'react-hook-form'

type FormSelectProps<T extends FieldValues> = {
    label: string
    name: Path<T>
    control: Control<T>
    options: string[]
    required?: boolean
    horizontal?: boolean
    rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'>
    className?: string
}

export default function FormSelect<T extends FieldValues>({
    label,
    name,
    control,
    options,
    required = false,
    horizontal = false,
    rules,
    className,
}: FormSelectProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            rules={required ? { required: 'This field is required', ...rules } : rules}
            render={({ field, fieldState }) => (
                <div className={cn('flex gap-2', horizontal ? 'flex-row items-center justify-between' : 'flex-col')}>
                    <label className={cn('font-medium text-neutral-50', horizontal && 'min-w-[150px] shrink-0')}>
                        {label}
                        {required && <span className="ml-0.5 text-neutral-200">*</span>}
                    </label>
                    <div className={cn(horizontal && '')}>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            defaultValue={field.value as string}
                        >
                            <SelectTrigger
                                className={cn(
                                    'h-[52px] w-full rounded-lg border-transparent bg-white/10 px-4 text-neutral-200 focus:border-blue-700',
                                    fieldState.error && 'border-red-500',
                                    className,
                                )}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.error && (
                            <p className="text-xs leading-tight text-red-500">{fieldState.error.message}</p>
                        )}
                    </div>
                </div>
            )}
        />
    )
}
