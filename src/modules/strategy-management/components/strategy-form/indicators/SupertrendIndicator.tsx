import FormSelect from '@/components/ui/FormSelect'
import IndicatorSection from '@/components/ui/IndicatorSection'
import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import { SUPERTREND_SRC } from '../../../constants/strategy-form.defaults'
import type { StrategyControl, StrategyWatch } from '../../../types/strategy-form.types'

type Props = { control: StrategyControl; watch: StrategyWatch }

export default function SupertrendIndicator({ control, watch }: Props) {
    return (
        <IndicatorSection title="Supertrend" roleFieldName="indicators.superTrend.role" control={control} watch={watch}>
            <InputField
                name="indicators.superTrend.atrPeriod"
                control={control}
                label="ATR Period"
                type="number"
                placeholder="10"
                rules={{ min: { value: 1, message: 'Min 1' } }}
                horizontal
            />
            <InputField
                name="indicators.superTrend.atrMultiplier"
                control={control}
                label="ATR Multiplier"
                type="number"
                placeholder="3"
                rules={{ min: { value: 0.1, message: 'Min 0.1' } }}
                horizontal
            />
            <FormSelect
                label="Source"
                name="indicators.superTrend.srcPrice"
                control={control}
                options={SUPERTREND_SRC}
                horizontal
            />

            <Separator />

            <p className="text-sm text-neutral-500">Defines trend direction and strength</p>
        </IndicatorSection>
    )
}
