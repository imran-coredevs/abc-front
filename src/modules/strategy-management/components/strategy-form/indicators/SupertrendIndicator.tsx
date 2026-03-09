import FormSelect from '@/components/ui/FormSelect'
import { InputField } from '@/components/ui/InputField'
import IndicatorSection from '@/components/ui/IndicatorSection'
import { SUPERTREND_SRC } from '../../../constants/strategy-form.defaults'
import type { StrategyControl, StrategyWatch } from '../../../types/strategy-form.types'

type Props = { control: StrategyControl; watch: StrategyWatch }

export default function SupertrendIndicator({ control, watch }: Props) {
    const role = watch('indicators.superTrend.role')
    const isSignal = role === 'signal'

    return (
        <IndicatorSection title="Supertrend" roleFieldName="indicators.superTrend.role" control={control} watch={watch}>
            <InputField
                name="indicators.superTrend.atrPeriod"
                control={control}
                label="ATR Period"
                type="number"
                placeholder="10"
                rules={{ min: { value: 1, message: 'Min 1' } }}
            />
            <InputField
                name="indicators.superTrend.atrMultiplier"
                control={control}
                label="ATR Multiplier"
                type="number"
                placeholder="3"
                rules={{ min: { value: 0.1, message: 'Min 0.1' } }}
            />
            <FormSelect label="Source" name="indicators.superTrend.srcPrice" control={control} options={SUPERTREND_SRC} />
            {isSignal && (
                <InputField
                    name="indicators.superTrend.signalLookbackBars"
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
