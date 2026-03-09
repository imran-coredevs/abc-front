import { cn } from '@/lib/utils'
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type FormSelectProps<T extends FieldValues> = {
    label: string
    name: Path<T>
    control: Control<T>
    options: string[]
    required?: boolean
    rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'>
    className?: string
}

export default function FormSelect<T extends FieldValues>({
    label,
    name,
    control,
    options,
    required = false,
    rules,
    className,
}: FormSelectProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            rules={required ? { required: 'This field is required', ...rules } : rules}
            render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-neutral-50">
                        {label}
                        {required && <span className="ml-0.5 text-neutral-200">*</span>}
                    </label>
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
            )}
        />
    )
}
