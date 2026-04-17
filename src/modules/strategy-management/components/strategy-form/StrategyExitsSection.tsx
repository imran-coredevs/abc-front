import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import { Controller, useFormContext } from 'react-hook-form'
import type { StrategyControl, StrategyFormData } from '../../types/strategy-form.types'

type ToggleRowProps = {
    name: 'strategyExits.onOppositeSignal' | 'strategyExits.onTrendChange' | 'strategyExits.allowReEntryOnActiveSignal'
    label: string
    control: StrategyControl
}

function ToggleRow({ name, label, control }: ToggleRowProps) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <span className="text-sm font-medium text-neutral-200">{label}</span>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            checked={field.value as boolean}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="peer sr-only"
                        />
                        <div className={cn('relative h-5 w-9 rounded-full transition-all duration-300', field.value ? 'bg-blue-700' : 'bg-neutral-600')}>
                            <div className={cn('absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300', field.value ? 'translate-x-4' : 'translate-x-0')} />
                        </div>
                    </label>
                )}
            />
        </div>
    )
}

export default function StrategyExitsSection() {
    const { control, watch } = useFormContext<StrategyFormData>()
    const allowReEntry = watch('strategyExits.allowReEntryOnActiveSignal')

    return (
        <div className="space-y-5 rounded-lg bg-white/5 p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-neutral-50">Strategy Exits</h2>
            <Separator />

            <div className="space-y-4 rounded-lg bg-neutral-950 p-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-neutral-50">Exit Condition</h3>
                    <p className="text-sm text-neutral-400">Choose when the strategy should close an active trade.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <ToggleRow
                        name="strategyExits.onOppositeSignal"
                        label="Exit on Opposite Signal"
                        control={control}
                    />
                    <ToggleRow
                        name="strategyExits.onTrendChange"
                        label="Exit on Trend Change"
                        control={control}
                    />
                </div>
            </div>

            <div className="space-y-4 rounded-lg bg-neutral-950 p-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-neutral-50">Exit & Re-Entry Logic</h3>
                    <p className="text-sm text-neutral-400">Control whether the strategy can re-enter after an exit.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <ToggleRow
                        name="strategyExits.allowReEntryOnActiveSignal"
                        label="Allow Re-Entry on Active Signal"
                        control={control}
                    />
                    {allowReEntry && (
                        <InputField
                            name="strategyExits.reEntryCooldownBars"
                            control={control}
                            label="Re-Entry Cooldown"
                            type="number"
                            placeholder="0 bars"
                            rules={{ required: 'Required', min: { value: 0, message: 'Min 0' } }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
