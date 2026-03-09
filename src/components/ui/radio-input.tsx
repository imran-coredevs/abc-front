import { Control, Controller, FieldValues } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { cn } from '@/lib/utils'

type Props = React.HtmlHTMLAttributes<HTMLButtonElement> & {
    name: string
    control: Control<FieldValues>
    options: { label: string; value: string }[]
    required?: boolean
    label?: string
}

export default function RadioInput({ name, control, options, required = true, label, className, ...props }: Props) {
    return (
        <Controller
            control={control}
            name={name}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
                <div className="flex flex-col gap-2">
                    {label && (
                        <label className="p-md text-neutral-800">
                            {label} {required && '*'}
                        </label>
                    )}

                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className={cn(className)}>
                        {options.map((opt) => (
                            <RadioGroupItem
                                key={opt.value}
                                value={opt.value}
                                id={opt.value}
                                label={opt.label}
                                {...props}
                            />
                        ))}
                    </RadioGroup>
                </div>
            )}
        />
    )
}
