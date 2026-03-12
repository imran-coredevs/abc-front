import { Button } from '@/components/ui/button'
import FormSelect from '@/components/ui/FormSelect'
import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import { Trash } from 'iconsax-reactjs'
import { Controller, useFieldArray } from 'react-hook-form'
import { STOP_LOSS_TYPES, TAKE_PROFIT_TYPES } from '../../constants/strategy-form.defaults'
import type { StrategyControl, StrategyWatch } from '../../types/strategy-form.types'

type Props = {
    control: StrategyControl
    watch: StrategyWatch
}

export default function RiskManagementSection({ control, watch }: Props) {
    return (
        <div className="w-full space-y-4 rounded-lg border border-white/10 bg-white/5 p-4 sm:p-5">
            <h2 className="text-xl font-semibold text-neutral-50">Risk Management</h2>
            <Separator />

            <div className="space-y-4">
                <StopLossCard control={control} watch={watch} />
                <TakeProfitCard control={control} watch={watch} />
                <BreakEvenCard control={control} watch={watch} />
                <TrailingStopCard control={control} watch={watch} />
            </div>
        </div>
    )
}

function StopLossCard({ control, watch }: Props) {
    const stopLossType = watch('risk.stopLoss.type')
    return (
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-5">
            <h5 className="font-semibold text-neutral-50">Stop Loss</h5>
            <Separator />
            <div className="space-y-4 rounded-lg bg-neutral-900 p-4">
                <FormSelect
                    label="Stop Loss Type"
                    name="risk.stopLoss.type"
                    control={control}
                    options={STOP_LOSS_TYPES}
                    required
                    horizontal
                />
                {stopLossType === 'FIXED_PERCENTAGE' && (
                    <InputField
                        name="risk.stopLoss.fixedPercentage"
                        control={control}
                        label="Fixed Stop Loss (%)"
                        type="number"
                        placeholder="e.g. 2"
                        rules={{ required: 'Required', min: { value: 0.01, message: 'Min 0.01' } }}
                        horizontal
                    />
                )}
                {stopLossType === 'STRUCTURAL' && (
                    <InputField
                        name="risk.stopLoss.structuralLookback"
                        control={control}
                        label="Structural Lookback (Candles)"
                        type="number"
                        horizontal
                        placeholder="e.g. 10"
                        rules={{ required: 'Required', min: { value: 1, message: 'Min 1' } }}
                    />
                )}
            </div>
        </div>
    )
}

function TakeProfitCard({ control, watch }: Props) {
    const tpType = watch('risk.takeProfit.type')
    const { fields, append, remove } = useFieldArray({ control, name: 'risk.takeProfit.partialLevels' })

    return (
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-5">
            <h5 className="font-semibold text-neutral-50">Take Profit</h5>
            <Separator />
            <div className="space-y-4 rounded-lg bg-neutral-900 p-4">
                <FormSelect
                    label="Take Profit Type"
                    name="risk.takeProfit.type"
                    control={control}
                    options={TAKE_PROFIT_TYPES}
                    horizontal
                    required
                />
                {tpType === 'FIXED_PERCENTAGE' && (
                    <InputField
                        name="risk.takeProfit.fixedPercentage"
                        control={control}
                        label="Fixed Take Profit (%)"
                        type="number"
                        placeholder="e.g. 4"
                        rules={{ required: 'Required', min: { value: 0.01, message: 'Min 0.01' } }}
                        horizontal
                    />
                )}
                {tpType === 'RISK_REWARD' && (
                    <InputField
                        name="risk.takeProfit.riskRewardRatio"
                        control={control}
                        label="Risk:Reward Ratio"
                        type="number"
                        placeholder="e.g. 2"
                        rules={{ required: 'Required', min: { value: 0.1, message: 'Min 0.1' } }}
                        horizontal
                    />
                )}
                {tpType === 'MULTI_LEVEL' && (
                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-2">
                                <div className="">
                                    <InputField
                                        name={`risk.takeProfit.partialLevels.${index}.triggerPercentage`}
                                        control={control}
                                        label={index === 0 ? 'Trigger (%)' : ''}
                                        type="number"
                                        placeholder="e.g. 2"
                                        rules={{ required: 'Required' }}
                                    />
                                </div>
                                <InputField
                                    name={`risk.takeProfit.partialLevels.${index}.closePercentage`}
                                    control={control}
                                    label={index === 0 ? 'Close (%)' : ''}
                                    type="number"
                                    placeholder="e.g. 50"
                                    rules={{ required: 'Required' }}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="mb-1.5 shrink-0 px-2 text-red-400 hover:text-red-300"
                                    onClick={() => remove(index)}
                                >
                                    <Trash />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="w-full border-white/20 text-neutral-300 hover:bg-white/10"
                            onClick={() => append({ triggerPercentage: 0, closePercentage: 50 })}
                        >
                            + Add Level
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

function TrailingStopCard({ control, watch }: Props) {
    const enabled = watch('risk.trailingStop.enabled')
    return (
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
                <h5 className="font-semibold text-neutral-50">Trailing Stop</h5>
                <Controller
                    name="risk.trailingStop.enabled"
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
            {enabled && (
                <>
                    <Separator />
                    <div className="space-y-4 rounded-lg bg-neutral-900 p-4">
                        <InputField
                            name="risk.trailingStop.trailingPercentage"
                            control={control}
                            label="Trailing Distance (%)"
                            type="number"
                            placeholder="e.g. 1"
                            rules={{ required: 'Required', min: { value: 0.01, message: 'Min 0.01' } }}
                            horizontal
                        />
                    </div>
                </>
            )}
        </div>
    )
}

function BreakEvenCard({ control, watch }: Props) {
    const enabled = watch('risk.breakEven.enabled')
    return (
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
                <h5 className="font-semibold text-neutral-50">Break-Even</h5>
                <Controller
                    name="risk.breakEven.enabled"
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
            {enabled && (
                <>
                    <Separator />
                    <div className="space-y-4 rounded-lg bg-neutral-900 p-4">
                        <InputField
                            name="risk.breakEven.triggerPercentage"
                            control={control}
                            label="Trigger Profit (%)"
                            type="number"
                            placeholder="e.g. 1"
                            rules={{ required: 'Required', min: { value: 0.01, message: 'Min 0.01' } }}
                            horizontal
                        />
                        <InputField
                            name="risk.breakEven.offsetPercentage"
                            control={control}
                            label="Offset (%)"
                            type="number"
                            placeholder="e.g. 0.1"
                            rules={{ required: 'Required' }}
                            horizontal
                        />
                    </div>
                </>
            )}
        </div>
    )
}
