import FormSelect from '@/components/ui/FormSelect'
import { InputField } from '@/components/ui/InputField'
import IndicatorSection from '@/components/ui/IndicatorSection'
import { PRICE_SOURCES, RSI_SMOOTHING } from '../../../constants/strategy-form.defaults'
import type { StrategyControl, StrategyWatch } from '../../../types/strategy-form.types'

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
            />
            <FormSelect label="Source" name="indicators.rsi.source" control={control} options={PRICE_SOURCES} />
            <FormSelect label="Smoothing Type" name="indicators.rsi.smoothingType" control={control} options={RSI_SMOOTHING} />
            {showSmoothingLength && (
                <InputField
                    name="indicators.rsi.smoothingLength"
                    control={control}
                    label="Smoothing Length"
                    type="number"
                    placeholder="14"
                    rules={{ min: { value: 1, message: 'Min 1' } }}
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
                />
            )}
            <InputField
                name="indicators.rsi.overboughtLevel"
                control={control}
                label="Overbought Level"
                type="number"
                placeholder="70"
                rules={{ min: { value: 50, message: 'Min 50' }, max: { value: 100, message: 'Max 100' } }}
            />
            <InputField
                name="indicators.rsi.oversoldLevel"
                control={control}
                label="Oversold Level"
                type="number"
                placeholder="30"
                rules={{ min: { value: 0, message: 'Min 0' }, max: { value: 50, message: 'Max 50' } }}
            />
            {isSignal && (
                <InputField
                    name="indicators.rsi.signalLookbackBars"
                    control={control}
                    label="Signal Lookback Bars"
                    type="number"
                    placeholder="1"
                    rules={{ min: { value: 0, message: 'Min 0' } }}
                />
            )}
        </IndicatorSection>
    )
}
