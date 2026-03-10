import FormSelect from '@/components/ui/FormSelect'
import { InputField } from '@/components/ui/InputField'
import IndicatorSection from '@/components/ui/IndicatorSection'
import { PRICE_SOURCES, RSI_SMOOTHING } from '../../../constants/strategy-form.defaults'
import type { StrategyControl, StrategyWatch } from '../../../types/strategy-form.types'
import Separator from '@/components/ui/Separator'

type Props = { control: StrategyControl; watch: StrategyWatch }

export default function RsiIndicator({ control, watch }: Props) {
    const smoothingType = watch('indicators.rsi.smoothingType')
    const role = watch('indicators.rsi.role')
    const isSignal = role === 'signal'
    const showSmoothingLength = smoothingType !== 'None'
    const showBbMultiplier = smoothingType === 'SMA + Bollinger Bands'

    return (
        <IndicatorSection title="RSI" roleFieldName="indicators.rsi.role" control={control} watch={watch}>
            <InputField
                name="indicators.rsi.period"
                control={control}
                label="RSI Period"
                type="number"
                placeholder="14"
                rules={{ min: { value: 1, message: 'Min 1' } }}
                horizontal
            />
            <FormSelect
                label="Source"
                name="indicators.rsi.source"
                control={control}
                options={PRICE_SOURCES}
                horizontal
            />
            <FormSelect
                label="Smoothing Type"
                name="indicators.rsi.smoothingType"
                control={control}
                options={RSI_SMOOTHING}
                horizontal
            />
            {showSmoothingLength && (
                <InputField
                    name="indicators.rsi.smoothingLength"
                    control={control}
                    label="Smoothing Length"
                    type="number"
                    placeholder="14"
                    rules={{ min: { value: 1, message: 'Min 1' } }}
                    horizontal
                />
            )}
            {showBbMultiplier && (
                <InputField
                    name="indicators.rsi.bbMultiplier"
                    control={control}
                    label="BB Multiplier"
                    type="number"
                    placeholder="2"
                    rules={{ min: { value: 0.1, message: 'Min 0.1' } }}
                    horizontal
                />
            )}
            <InputField
                name="indicators.rsi.overboughtLevel"
                control={control}
                label="Overbought Level"
                type="number"
                placeholder="70"
                rules={{ min: { value: 50, message: 'Min 50' }, max: { value: 100, message: 'Max 100' } }}
                horizontal
            />
            <InputField
                name="indicators.rsi.oversoldLevel"
                control={control}
                label="Oversold Level"
                type="number"
                placeholder="30"
                rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 50, message: 'Max 50' } }}
                horizontal
            />
            {isSignal && (
                <InputField
                    name="indicators.rsi.signalLookbackBars"
                    control={control}
                    label="Signal Lookback Bars"
                    type="number"
                    placeholder="1"
                    rules={{ min: { value: 0, message: 'Min 0' } }}
                    horizontal
                />
            )}

            <Separator />

            <p className='text-neutral-500 text-sm'>Used to detect overbought and oversold conditions</p>
        </IndicatorSection>
    )
}
