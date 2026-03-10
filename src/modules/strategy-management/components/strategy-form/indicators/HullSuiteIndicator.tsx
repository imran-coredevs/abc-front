import FormSelect from '@/components/ui/FormSelect'
import IndicatorSection from '@/components/ui/IndicatorSection'
import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import { HULL_MODES } from '../../../constants/strategy-form.defaults'
import type { StrategyControl, StrategyWatch } from '../../../types/strategy-form.types'

type Props = { control: StrategyControl; watch: StrategyWatch }

export default function HullSuiteIndicator({ control, watch }: Props) {
    const role = watch('indicators.hullSuite.role')
    const isSignal = role === 'signal'

    return (
        <IndicatorSection title="Hull Suite" roleFieldName="indicators.hullSuite.role" control={control} watch={watch}>
            <InputField
                name="indicators.hullSuite.length"
                control={control}
                label="HMA Length"
                type="number"
                placeholder="55"
                rules={{ min: { value: 1, message: 'Min 1' } }}
                horizontal
            />
            <InputField
                name="indicators.hullSuite.lengthMultiplier"
                control={control}
                label="Length Multiplier"
                type="number"
                placeholder="2"
                rules={{ min: { value: 0.1, message: 'Min 0.1' } }}
                horizontal
            />
            <FormSelect
                label="Mode"
                name="indicators.hullSuite.mode"
                control={control}
                options={HULL_MODES}
                horizontal
            />
            {isSignal && (
                <InputField
                    name="indicators.hullSuite.signalLookbackBars"
                    control={control}
                    label="Signal Lookback Bars"
                    type="number"
                    placeholder="1"
                    rules={{ min: { value: 0, message: 'Min 0' } }}
                    horizontal
                />
            )}

            <Separator />

            <p className="text-sm text-neutral-500">Smooths price action to identify trend direction.</p>
        </IndicatorSection>
    )
}
