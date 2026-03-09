import { cn } from '@/lib/utils'
import { Controller, type Control, type FieldValues, type Path, type UseFormWatch } from 'react-hook-form'
import Separator from '@/components/ui/Separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Map raw role keys to human-readable labels
const ROLE_LABELS: Record<string, string> = {
    signal: 'Signal',
    filterOnly: 'Filter Only',
    disabled: 'Disabled',
}

function formatRole(role: string): string {
    return ROLE_LABELS[role] ?? role
}

type IndicatorSectionProps<T extends FieldValues> = {
    title: string
    roleFieldName: Path<T>
    availableRoles?: string[]
    control: Control<T>
    watch: UseFormWatch<T>
    children: React.ReactNode
}

export default function IndicatorSection<T extends FieldValues>({
    title,
    roleFieldName,
    availableRoles = ['signal', 'filterOnly'],
    control,
    watch,
    children,
}: IndicatorSectionProps<T>) {
    const currentRole = watch(roleFieldName) as string
    const isEnabled = currentRole !== 'disabled'
    const nonDisabledRoles = availableRoles.filter(r => r !== 'disabled')

    return (
        <div
            className={cn(
                'space-y-4 rounded-lg border p-6 transition-colors',
                isEnabled ? 'border-white/10 bg-white/5' : 'border-white/5 opacity-60',
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-neutral-50">{title}</h3>

                <div className="flex items-center gap-3">
                    {/* Role selector — only shown when enabled and more than one role is available */}
                    {isEnabled && nonDisabledRoles.length > 1 && (
                        <Controller
                            name={roleFieldName}
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value as string}>
                                    <SelectTrigger className="h-8 w-28 rounded-md border-white/20 bg-white/10 text-xs text-neutral-200">
                                        <SelectValue>
                                            {formatRole(field.value as string)}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nonDisabledRoles.map(role => (
                                            <SelectItem key={role} value={role}>
                                                {formatRole(role)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    )}

                    {/* When only one role available (e.g. ADX = filterOnly), show a static label */}
                    {isEnabled && nonDisabledRoles.length === 1 && (
                        <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-neutral-400">
                            {formatRole(nonDisabledRoles[0])}
                        </span>
                    )}

                    {/* Enable/disable toggle */}
                    <Controller
                        name={roleFieldName}
                        control={control}
                        render={({ field }) => (
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={(field.value as string) !== 'disabled'}
                                    onChange={(e) => {
                                        field.onChange(
                                            e.target.checked
                                                ? (nonDisabledRoles[0] ?? 'filterOnly')
                                                : 'disabled'
                                        )
                                    }}
                                    className="peer sr-only"
                                />
                                <div
                                    className={cn(
                                        'relative h-5 w-9 rounded-full transition-all duration-300',
                                        (field.value as string) !== 'disabled' ? 'bg-blue-700' : 'bg-neutral-600',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300',
                                            (field.value as string) !== 'disabled' ? 'translate-x-4' : 'translate-x-0',
                                        )}
                                    />
                                </div>
                            </label>
                        )}
                    />
                </div>
            </div>

            {isEnabled && (
                <>
                    <Separator />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
                </>
            )}
        </div>
    )
}
