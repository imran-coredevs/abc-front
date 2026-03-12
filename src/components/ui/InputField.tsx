import { cn } from '@/lib/utils'
import { Eye, EyeSlash, SearchNormal1 } from 'iconsax-reactjs'
import { useRef, useState } from 'react'
import { Control, Controller, FieldPath, FieldValues, Path, RegisterOptions } from 'react-hook-form'

interface InputFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> extends React.InputHTMLAttributes<HTMLInputElement> {
    name: Path<TFieldValues>
    control: Control<TFieldValues>
    label?: string
    className?: string
    type?: 'text' | 'password' | 'search' | 'toggle' | 'number' | 'tel'
    suffix?: string
    horizontal?: boolean
    rules?: Omit<
        RegisterOptions<TFieldValues, FieldPath<TFieldValues>>,
        'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'
    >
}

const INPUT_BASE_CLASSES =
    'h-[52px] px-4 rounded-lg bg-white/10 border border-transparent transition-colors outline-none'
const INPUT_FOCUS_CLASSES = 'focus:border-blue-700 caret-blue-700'
const ERROR_CLASSES = 'border-red-500'

export const InputField = <TFieldValues extends FieldValues = FieldValues>({
    name,
    control,
    label,
    className,
    type = 'text',
    suffix,
    horizontal = false,
    rules,
    ...props
}: InputFieldProps<TFieldValues>) => {
    const [showPassword, setShowPassword] = useState(false)
    const [searchActive, setSearchActive] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    return (
        <div className={cn('flex min-h-[52px] gap-2', horizontal ? 'flex-col sm:flex-row sm:items-center sm:justify-between' : 'flex-col')}>
            {label && (
                <label
                    className={cn(
                        'p-md flex items-center gap-1 font-medium text-neutral-50',
                        horizontal && 'sm:min-w-[150px] shrink-0',
                        props.disabled && 'cursor-not-allowed opacity-50',
                    )}
                >
                    {label}
                    {rules?.required && <span className="text-neutral-200">*</span>}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState }) => {
                    // TOGGLE FIELD
                    if (type === 'toggle') {
                        return (
                            <div className="flex min-h-[52px] items-center">
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={field.value || false}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        {...props}
                                        className="peer sr-only"
                                    />
                                    <div
                                        className={cn(
                                            'relative h-[20px] w-[38px] rounded-full transition-all duration-300 ease-in-out',
                                            field.value ? 'bg-blue-700' : 'bg-neutral-100',
                                            className,
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'absolute top-[2px] left-[3px] h-4 w-4 rounded-full transition-all duration-300 ease-in-out',
                                                field.value ? 'translate-x-4 bg-white' : 'bg-neutral-400',
                                            )}
                                        />
                                    </div>
                                    {suffix && (
                                        <span className="p-sm ml-3 font-medium text-gray-900 dark:text-gray-300">
                                            {suffix}
                                        </span>
                                    )}
                                </label>
                            </div>
                        )
                    }

                    // PASSWORD FIELD
                    if (type === 'password') {
                        return (
                            <div className="flex w-full flex-col gap-1.5">
                                <div
                                    className={cn(
                                        INPUT_BASE_CLASSES,
                                        INPUT_FOCUS_CLASSES,
                                        'flex items-center overflow-hidden',
                                        fieldState.error ? ERROR_CLASSES : 'focus-within:border-blue-400',
                                    )}
                                >
                                    <input
                                        {...field}
                                        {...props}
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="off"
                                        className={cn(
                                            'p-sm h-full flex-1 bg-transparent text-neutral-200 outline-none',
                                            className,
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="flex h-full cursor-pointer items-center px-2 text-neutral-400 transition-colors hover:text-neutral-200"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <Eye size={20} className="text-neutral-400" />
                                        ) : (
                                            <EyeSlash size={20} className="text-neutral-400" />
                                        )}
                                    </button>
                                </div>
                                {fieldState.error && (
                                    <p className="text-xs leading-tight text-red-500">{fieldState.error.message}</p>
                                )}
                            </div>
                        )
                    }

                    // SEARCH FIELD
                    if (type === 'search') {
                        return (
                            <div
                                ref={containerRef}
                                className={cn(
                                    'relative flex h-[52px] w-full max-w-md items-center gap-3 overflow-hidden rounded-[36px] border bg-neutral-800 px-4 transition-all',
                                    INPUT_FOCUS_CLASSES,
                                    searchActive ? 'border-blue-400' : 'cursor-pointer border-transparent',
                                )}
                                onClick={() => setSearchActive(true)}
                            >
                                <SearchNormal1 size="20" className="text-neutral-400" />
                                <input
                                    {...field}
                                    {...props}
                                    type="text"
                                    autoComplete="off"
                                    className={cn(
                                        'p-sm h-full w-full bg-transparent text-neutral-200 transition-all duration-300 ease-out outline-none',
                                        className,
                                    )}
                                    autoFocus={searchActive}
                                    placeholder={props.placeholder || 'Search'}
                                />
                            </div>
                        )
                    }

                    // DEFAULT TEXT FIELD
                    return (
                        <div className={cn('flex flex-col gap-1.5' + (horizontal ? ' w-full sm:max-w-[10.5rem]' : ''))}>
                            <input
                                {...field}
                                {...props}
                                type={type}
                                autoComplete="off"
                                disabled={props.disabled}
                                className={cn(
                                    INPUT_BASE_CLASSES,
                                    INPUT_FOCUS_CLASSES,
                                    'p-sm text-neutral-200',
                                    props.disabled && 'cursor-not-allowed opacity-50',
                                    fieldState.error && ERROR_CLASSES,
                                    className,
                                )}
                            />

                            {fieldState.error && (
                                <p className="text-xs leading-tight text-red-500">{fieldState.error.message}</p>
                            )}
                        </div>
                    )
                }}
            />
        </div>
    )
}
