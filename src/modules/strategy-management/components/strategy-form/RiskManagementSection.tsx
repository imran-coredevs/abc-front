import { Button } from '@/components/ui/button'
import FormSelect from '@/components/ui/FormSelect'
import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import { Trash } from 'iconsax-reactjs'
import { Controller, useFieldArray } from 'react-hook-form'
import { useState } from 'react'
import { STOP_LOSS_TYPES, TAKE_PROFIT_TYPES } from '../../constants/strategy-form.defaults'
import type { StrategyControl, StrategyWatch } from '../../types/strategy-form.types'

type Props = {
    control: StrategyControl
    watch: StrategyWatch
}

export default function RiskManagementSection({ control, watch }: Props) {
    const [stopLossExpanded, setStopLossExpanded] = useState(true)
    const [takeProfitExpanded, setTakeProfitExpanded] = useState(true)
    const [exitConditionsExpanded, setExitConditionsExpanded] = useState(true)

    return (
        <div className="w-full space-y-5 rounded-lg bg-white/5 p-4 sm:p-5">
            <h2 className="text-xl font-semibold text-neutral-50">Risk Management</h2>
            <Separator />

            <div className="space-y-4">
                <StopLossCard control={control} watch={watch} expanded={stopLossExpanded} onToggle={setStopLossExpanded} />
                <TakeProfitCard control={control} watch={watch} expanded={takeProfitExpanded} onToggle={setTakeProfitExpanded} />
                <TrailingStopCard control={control} watch={watch} />
                <ExitConditionsCard control={control} watch={watch} expanded={exitConditionsExpanded} onToggle={setExitConditionsExpanded} />
                <BreakEvenCard control={control} watch={watch} />
                <ExitReEntryCard control={control} watch={watch} />
            </div>
        </div>
    )
}

type ExpandedProps = {
    expanded: boolean
    onToggle: (value: boolean) => void
}

function StopLossCard({ control, watch, expanded, onToggle }: Props & ExpandedProps) {
    const stopLossType = watch('risk.stopLoss.type')
    return (
        <div className="space-y-3">
            <SectionHeader title="Stop-Loss Configuration" active={expanded} onToggle={onToggle} />
            {expanded && (
                <div className="space-y-4 rounded-lg bg-neutral-950 p-4">
                    <FormSelect
                        label="Stop Loss Type"
                        name="risk.stopLoss.type"
                        control={control}
                        options={STOP_LOSS_TYPES.map((opt) =>
                            opt.value === 'FIXED_PERCENTAGE'
                                ? { value: opt.value, label: 'Fixed' }
                                : { value: opt.value, label: 'Structural' },
                        )}
                        required
                        horizontal
                    />
                    {stopLossType === 'FIXED_PERCENTAGE' && (
                        <InputField
                            name="risk.stopLoss.fixedPercentage"
                            control={control}
                            label="Stop Loss (%)"
                            type="number"
                            placeholder="e.g., 25%"
                            step="0.01"
                            rules={{ required: 'Required', min: { value: 0.01, message: 'Min 0.01' } }}
                            horizontal
                        />
                    )}
                    {stopLossType === 'STRUCTURAL' && (
                        <>
                            <InputField
                                name="risk.stopLoss.structuralLookback"
                                control={control}
                                label="Structural Lookback (Candles)"
                                type="number"
                                step="1"
                                horizontal
                                placeholder="e.g., 10"
                                rules={{ required: 'Required', min: { value: 1, message: 'Min 1' } }}
                            />
                            <InputField
                                name="risk.stopLoss.structuralBufferPercent"
                                control={control}
                                label="Structural Buffer (%)"
                                type="number"
                                step="0.01"
                                horizontal
                                placeholder="e.g., 0.1"
                                rules={{ min: { value: 0.0001, message: 'Min 0.0001' } }}
                            />
                            <InputField
                                name="risk.stopLoss.structuralMaxDistancePercent"
                                control={control}
                                label="Max Entry-to-SL Distance (%)"
                                type="number"
                                step="0.01"
                                horizontal
                                placeholder="e.g., 5"
                                rules={{ min: { value: 0.01, message: 'Min 0.01' } }}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

function TakeProfitCard({ control, watch, expanded, onToggle }: Props & ExpandedProps) {
    const tpType = watch('risk.takeProfit.type')

    return (
        <div className="space-y-3">
            <SectionHeader title="Take-Profit Configuration" active={expanded} onToggle={onToggle} />
            {expanded && (
                <div className="space-y-4 rounded-lg bg-neutral-950 p-4">
                    <FormSelect
                        label="Take Profit Type"
                        name="risk.takeProfit.type"
                        control={control}
                        options={TAKE_PROFIT_TYPES.map((opt) => {
                            if (opt.value === 'FIXED_PERCENTAGE') return { value: opt.value, label: 'Fixed Take Profit' }
                            if (opt.value === 'RISK_REWARD') return { value: opt.value, label: 'Risk Reward' }
                            return { value: opt.value, label: 'Multi Level' }
                        })}
                        horizontal
                        required
                    />
                    {tpType === 'FIXED_PERCENTAGE' && (
                        <InputField
                            name="risk.takeProfit.fixedPercentage"
                            control={control}
                            label="Take Profit (%)"
                            type="number"
                            placeholder="e.g., 25%"
                            step="0.01"
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
                            placeholder="e.g., 2"
                            step="0.1"
                            rules={{ required: 'Required', min: { value: 0.1, message: 'Min 0.1' } }}
                            horizontal
                        />
                    )}
                    {tpType === 'MULTI_LEVEL' && <MultiLevelTakeProfitCard control={control} watch={watch} />}
                </div>
            )}
        </div>
    )
}

function MultiLevelTakeProfitCard({ control, watch }: Props) {
    const tpType = watch('risk.takeProfit.type')
    const { fields, append, remove } = useFieldArray({ control, name: 'risk.takeProfit.partialLevels' })

    return (
        <div className="space-y-3">
            <h5 className="text-lg font-medium text-neutral-50">Multi-Level Take Profit</h5>
            {tpType === 'MULTI_LEVEL' && (
                <div className="space-y-3 rounded-lg bg-neutral-950 p-4">
                    <div className="grid grid-cols-[96px_minmax(0,1fr)_154px_40px] gap-3 px-2 text-sm text-neutral-200 sm:grid-cols-[96px_154px_154px_40px]">
                        <span>Profit Stage</span>
                        <span>Target Profit (%)</span>
                        <span>Close Portion (%)</span>
                        <span />
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid grid-cols-[96px_minmax(0,1fr)_154px_40px] items-center gap-3 sm:grid-cols-[96px_154px_154px_40px]"
                            >
                                <div className="pl-2 text-sm font-medium text-neutral-50">Level {index + 1}</div>
                                <InputField
                                    name={`risk.takeProfit.partialLevels.${index}.triggerPercentage`}
                                    control={control}
                                    type="number"
                                    placeholder="e.g., 2"
                                    step="0.01"
                                    rules={{ required: 'Required' }}
                                />
                                <InputField
                                    name={`risk.takeProfit.partialLevels.${index}.closePercentage`}
                                    control={control}
                                    type="number"
                                    placeholder="e.g., 20%"
                                    step="0.01"
                                    rules={{ required: 'Required' }}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="size-10 shrink-0 px-2 text-red-400 hover:text-red-300"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full justify-start border-none bg-transparent px-2 text-violet-400 hover:bg-white/5 hover:text-violet-300"
                        onClick={() => append({ triggerPercentage: 0, closePercentage: 50 })}
                    >
                        + Add Target Level
                    </Button>
                </div>
            )}
        </div>
    )
}

function ExitConditionsCard({ control, watch, expanded, onToggle }: Props & ExpandedProps) {
    const onOppositeSignal = watch('strategyExits.onOppositeSignal')
    const onTrendChange = watch('strategyExits.onTrendChange')
    const enabled = !!onOppositeSignal || !!onTrendChange

    return (
        <div className="space-y-3">
            <SectionHeader title="Exit Conditions" active={expanded} onToggle={onToggle} />
            {expanded && (
                <div className="space-y-3 rounded-lg bg-neutral-950 p-4">
                    <ExitConditionRow
                        name="strategyExits.onOppositeSignal"
                        title="Exit on Opposite Signal"
                        subtitle="Close position when the primary signal reverses direction"
                        control={control}
                    />
                    <ExitConditionRow
                        name="strategyExits.onTrendChange"
                        title="Exit on Trend Reversal"
                        subtitle="Close position when trend indicators change direction"
                        control={control}
                    />
                </div>
            )}
        </div>
    )
}

function BreakEvenCard({ control, watch }: Props) {
    const enabled = watch('risk.breakEven.enabled')

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
                <h5 className="text-lg font-medium text-neutral-50">Break-Even Protection</h5>
                <Controller
                    name="risk.breakEven.enabled"
                    control={control}
                    render={({ field }) => <StaticToggleButton active={!!field.value} onClick={() => field.onChange(!field.value)} />}
                />
            </div>
            {enabled && (
                <div className="space-y-4 rounded-lg bg-neutral-950 p-4">
                    <InputField
                        name="risk.breakEven.triggerPercentage"
                        control={control}
                        label="Trigger Profit %"
                        type="number"
                        placeholder="e.g., 2"
                        step="0.01"
                        rules={{ required: 'Required', min: { value: 0.01, message: 'Min 0.01' } }}
                        horizontal
                    />
                    <div className="space-y-1">
                        <InputField
                            name="risk.breakEven.offsetPercentage"
                            control={control}
                            label="Offset"
                            type="number"
                            placeholder="e.g., 0.1"
                            step="0.01"
                            rules={{ required: 'Required' }}
                            horizontal
                        />
                        <p className="pl-[150px] text-sm text-neutral-500">Offset means SL moves slightly above entry</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function TrailingStopCard({ control, watch }: Props) {
    const enabled = watch('risk.trailingStop.enabled')

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
                <h5 className="text-lg font-medium text-neutral-50">Trailing Stop</h5>
                <Controller
                    name="risk.trailingStop.enabled"
                    control={control}
                    render={({ field }) => <StaticToggleButton active={!!field.value} onClick={() => field.onChange(!field.value)} />}
                />
            </div>
            {enabled && (
                <div className="space-y-4 rounded-lg bg-neutral-950 p-4">
                    <InputField
                        name="risk.trailingStop.trailingPercentage"
                        control={control}
                        label="Trailing %"
                        type="number"
                        placeholder="e.g., 1"
                        step="0.01"
                        rules={{ required: 'Required', min: { value: 0.01, message: 'Min 0.01' } }}
                        horizontal
                    />
                </div>
            )}
        </div>
    )
}

function ExitReEntryCard({ control, watch }: Props) {
    const allowReEntry = watch('strategyExits.allowReEntryOnActiveSignal')

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
                <h5 className="text-lg font-medium text-neutral-50">Exit & Re-Entry Logic</h5>
                <Controller
                    name="strategyExits.allowReEntryOnActiveSignal"
                    control={control}
                    render={({ field }) => <StaticToggleButton active={!!field.value} onClick={() => field.onChange(!field.value)} />}
                />
            </div>
            {allowReEntry && (
                <div className="space-y-4 rounded-lg bg-neutral-950 p-4">
                    <div className="space-y-1 text-sm text-neutral-400">Exit and re-enter when opposite signal appears</div>
                    {allowReEntry && (
                        <InputField
                            name="strategyExits.reEntryCooldownBars"
                            control={control}
                            label="Re-Entry Cooldown (Bars)"
                            type="number"
                            placeholder="0 bars"
                            rules={{ required: 'Required', min: { value: 0, message: 'Min 0' } }}
                            horizontal
                        />
                    )}
                </div>
            )}
        </div>
    )
}

type SectionHeaderProps = {
    title: string
    active: boolean
    onToggle: (value: boolean) => void
}

function SectionHeader({ title, active, onToggle }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <h5 className="text-lg font-medium text-neutral-50">{title}</h5>
            <button type="button" onClick={() => onToggle(!active)} aria-pressed={active} className="outline-none">
                <StaticToggle active={active} />
            </button>
        </div>
    )
}

type StaticToggleButtonProps = {
    active: boolean
    onClick: () => void
}

function StaticToggleButton({ active, onClick }: StaticToggleButtonProps) {
    return (
        <button type="button" onClick={onClick} aria-pressed={active} className="outline-none">
            <StaticToggle active={active} />
        </button>
    )
}

type ExitConditionRowProps = {
    name: 'strategyExits.onOppositeSignal' | 'strategyExits.onTrendChange'
    title: string
    subtitle: string
    control: StrategyControl
}

function ExitConditionRow({ name, title, subtitle, control }: ExitConditionRowProps) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-lg bg-white/5 px-4 py-3">
            <div className="space-y-1">
                <div className="text-base font-medium text-neutral-50">{title}</div>
                <div className="text-sm text-neutral-400">{subtitle}</div>
            </div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <label className="relative inline-flex cursor-pointer items-center pt-1">
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
    )
}

type StaticToggleProps = {
    active: boolean
}

function StaticToggle({ active }: StaticToggleProps) {
    return (
        <div className={cn('relative h-5 w-9 rounded-full transition-all duration-300', active ? 'bg-blue-700' : 'bg-neutral-600')}>
            <div
                className={cn(
                    'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300',
                    active ? 'translate-x-4' : 'translate-x-0',
                )}
            />
        </div>
    )
}
