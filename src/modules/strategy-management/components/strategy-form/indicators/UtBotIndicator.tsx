import { InputField } from '@/components/ui/InputField'
import IndicatorSection from '@/components/ui/IndicatorSection'
import { cn } from '@/lib/utils'
import { Controller } from 'react-hook-form'
import type { StrategyControl, StrategyWatch } from '../../../types/strategy-form.types'
import Separator from '@/components/ui/Separator'

type Props = { control: StrategyControl; watch: StrategyWatch }

export default function UtBotIndicator({ control, watch }: Props) {
    const role = watch('indicators.utBot.role')
    const isSignal = role === 'signal'

    return (
        <IndicatorSection title="UT Bot" roleFieldName="indicators.utBot.role" control={control} watch={watch}>
            <InputField
                name="indicators.utBot.atrPeriod"
                control={control}
                label="ATR Period"
                type="number"
                placeholder="10"
                rules={{ min: { value: 1, message: 'Min 1' } }}
                horizontal
            />
            <InputField
                name="indicators.utBot.atrMultiplier"
                control={control}
                label="ATR Multiplier"
                type="number"
                placeholder="1"
                rules={{ min: { value: 0.1, message: 'Min 0.1' } }}
                horizontal
            />
            {isSignal && (
                <InputField
                    name="indicators.utBot.signalLookbackBars"
                    control={control}
                    label="Signal Lookback Bars"
                    type="number"
                    placeholder="1"
                    rules={{ min: { value: 0, message: 'Min 0' } }}
                    horizontal
                />
            )}
            <div className="flex flex-row justify-between gap-2">
                <label className="font-medium text-neutral-50">Use Heikin Ashi</label>
                <Controller
                    name="indicators.utBot.useHeikinAshi"
                    control={control}
                    render={({ field }) => (
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={field.value as boolean}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div
                                className={cn(
                                    'relative h-5 w-9 rounded-full transition-all duration-300',
                                    field.value ? 'bg-blue-700' : 'bg-neutral-600',
                                )}
                            >
                                <div
                                    className={cn(
                                        'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300',
                                        field.value ? 'translate-x-4' : 'translate-x-0',
                                    )}
                                />
                            </div>
                        </label>
                    )}
                />
            </div>

            <Separator />

            <p className="text-sm text-neutral-500">Controls how sensitive UT Bot signals are.</p>
        </IndicatorSection>
    )
}
