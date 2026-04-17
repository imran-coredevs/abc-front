import FormSelect from '@/components/ui/FormSelect'
import { InputField } from '@/components/ui/InputField'
import IndicatorSection from '@/components/ui/IndicatorSection'
import { ADX_CONDITIONS, ADX_ROLES } from '../../../constants/strategy-form.defaults'
import type { StrategyFormData } from '../../../types/strategy-form.types'
import Separator from '@/components/ui/Separator'
import { useFormContext } from 'react-hook-form'

// ADX role is always 'filterOnly' (cannot emit signals) — no signalLookbackBars.
export default function AdxIndicator() {
    const { control, watch } = useFormContext<StrategyFormData>()
    return (
        <IndicatorSection
            title="ADX"
            roleFieldName="indicators.adx.role"
            availableRoles={ADX_ROLES}
            control={control}
            watch={watch}
        >
            <InputField
                name="indicators.adx.diLength"
                control={control}
                label="DI Length"
                type="number"
                placeholder="14"
                rules={{ min: { value: 1, message: 'Min 1' } }}
                horizontal
            />
            <InputField
                name="indicators.adx.adxLength"
                control={control}
                label="ADX Length"
                type="number"
                placeholder="14"
                rules={{ min: { value: 1, message: 'Min 1' } }}
                horizontal
            />
            <InputField
                name="indicators.adx.threshold"
                control={control}
                label="ADX Threshold"
                type="number"
                placeholder="25"
                rules={{ min: { value: 1, message: 'Min 1' } }}
                horizontal
            />
            <FormSelect
                label="Condition Type"
                name="indicators.adx.conditionType"
                control={control}
                options={ADX_CONDITIONS}
                horizontal
            />
            <Separator />

            <p className="text-sm text-neutral-500">Smooths price action to identify trend direction.</p>
        </IndicatorSection>
    )
}
