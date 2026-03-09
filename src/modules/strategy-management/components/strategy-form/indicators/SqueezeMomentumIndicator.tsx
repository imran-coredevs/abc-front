import { InputField } from '@/components/ui/InputField'
import IndicatorSection from '@/components/ui/IndicatorSection'
import { cn } from '@/lib/utils'
import { Controller } from 'react-hook-form'
import type { StrategyControl, StrategyWatch } from '../../../types/strategy-form.types'

type Props = { control: StrategyControl; watch: StrategyWatch }

export default function SqueezeMomentumIndicator({ control, watch }: Props) {
    const role = watch('indicators.squeezeMomentum.role')
    const isSignal = role === 'signal'

    return (
        <IndicatorSection title="Squeeze Momentum" roleFieldName="indicators.squeezeMomentum.role" control={control} watch={watch}>
            <InputField
                name="indicators.squeezeMomentum.bollingerBandsPeriod"
                control={control}
                label="Bollinger Band Period"
                type="number"
                placeholder="20"
                rules={{ min: { value: 1, message: 'Min 1' } }}
            />
            <InputField
                name="indicators.squeezeMomentum.bollingerBandsMultiplier"
                control={control}
                label="BB Multiplier"
                type="number"
                placeholder="2"
                rules={{ min: { value: 0.1, message: 'Min 0.1' } }}
            />
            <InputField
                name="indicators.squeezeMomentum.keltnerChannelPeriod"
                control={control}
                label="Keltner Channel Period"
                type="number"
                placeholder="20"
                rules={{ min: { value: 1, message: 'Min 1' } }}
            />
            <InputField
                name="indicators.squeezeMomentum.keltnerChannelMultiplier"
                control={control}
                label="KC Multiplier"
                type="number"
                placeholder="1.5"
                rules={{ min: { value: 0.1, message: 'Min 0.1' } }}
            />
            {isSignal && (
                <InputField
                    name="indicators.squeezeMomentum.signalLookbackBars"
                    control={control}
                    label="Signal Lookback Bars"
                    type="number"
                    placeholder="1"
                    rules={{ min: { value: 0, message: 'Min 0' } }}
                />
            )}
            <div className="flex flex-col gap-2">
                <label className="font-medium text-neutral-50">Use True Range (KC)</label>
                <Controller
                    name="indicators.squeezeMomentum.useTrueRange"
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
        </IndicatorSection>
    )
}
