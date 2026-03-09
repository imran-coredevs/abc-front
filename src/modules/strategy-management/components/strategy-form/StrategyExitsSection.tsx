import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import { Controller } from 'react-hook-form'
import type { StrategyControl, StrategyWatch } from '../../types/strategy-form.types'

type Props = {
    control: StrategyControl
    watch: StrategyWatch
}

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

export default function StrategyExitsSection({ control, watch }: Props) {
    const allowReEntry = watch('strategyExits.allowReEntryOnActiveSignal')

    return (
        <div className="space-y-4 rounded-lg bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-neutral-50">Strategy Exits</h2>
            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <ToggleRow
                    name="strategyExits.allowReEntryOnActiveSignal"
                    label="Allow Re-Entry on Active Signal"
                    control={control}
                />
                {allowReEntry && (
                    <InputField
                        name="strategyExits.reEntryCooldownBars"
                        control={control}
                        label="Re-Entry Cooldown (Bars)"
                        type="number"
                        placeholder="1"
                        rules={{ required: 'Required', min: { value: 1, message: 'Min 1' } }}
                    />
                )}
            </div>
        </div>
    )
}
