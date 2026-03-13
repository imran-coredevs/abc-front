import FormSelect from '@/components/ui/FormSelect'
import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import SymbolSearchSelect from '@/components/ui/SymbolSearchSelect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { CAPITAL_ALLOCATION_TYPES, TIMEFRAMES } from '../../constants/strategy-form.defaults'
import type { StrategyControl, StrategySetValue, StrategyWatch } from '../../types/strategy-form.types'
import IndicatorsSection from './IndicatorsSection'
import RiskManagementSection from './RiskManagementSection'
import StrategyExitsSection from './StrategyExitsSection'
import { useQuery } from '@tanstack/react-query'
import investorService, { type BinanceBalance } from '@/services/investorService'

type Props = {
    control: StrategyControl
    watch: StrategyWatch
    setValue: StrategySetValue
}

export default function BasicConfigSection({ control, watch, setValue }: Props) {
    const capitalAllocationType = watch('capitalAllocationType')
    const allocationValue = watch('allocationValue')
    const positionSizingMethod = watch('positionSizingMethod')
    const leverage = watch('leverage')
    const maxTradeDuration = watch('maxTradeDuration')

    const isPercentageAlloc = capitalAllocationType === 'PERCENTAGE_OF_PORTFOLIO'
    const [durationUnit, setDurationUnit] = useState<'SECOND' | 'MINUTE' | 'HOUR'>('SECOND')
    const [durationDraft, setDurationDraft] = useState<string | null>(null)
    const figmaRadioClass =
        'relative size-5 appearance-none rounded-full border border-blue-800 bg-transparent outline-none transition checked:border-blue-800 checked:bg-[radial-gradient(circle,_#6545ee_0_35%,_transparent_36%)] focus-visible:ring-2 focus-visible:ring-blue-800/50 cursor-pointer'

    // Fetch Binance balance
    const { data: balanceData } = useQuery<BinanceBalance>({
        queryKey: ['binance-balance'],
        queryFn: investorService.getBinanceBalance,
        retry: false,
    })

    // Calculate portfolio allocation
    const calculatePortfolioAllocation = () => {
        if (isPercentageAlloc && balanceData?.availableBalance) {
            const percentage = Number(allocationValue) || 0
            return (balanceData.availableBalance * percentage) / 100
        }
        return Number(allocationValue) || 0
    }

    const portfolioAllocation = calculatePortfolioAllocation()

    // Cap allocation value at 100 when switching to percentage
    useEffect(() => {
        if (isPercentageAlloc && allocationValue > 100) {
            setValue('allocationValue', 100, { shouldValidate: true })
        }
    }, [isPercentageAlloc, allocationValue, setValue])

    const getDurationMultiplier = (unit: 'SECOND' | 'MINUTE' | 'HOUR') => {
        if (unit === 'MINUTE') return 60
        if (unit === 'HOUR') return 3600
        return 1
    }

    const handleLeverageChange = (delta: number) => {
        const current = Number(leverage) || 0
        const next = Math.min(125, Math.max(1, current + delta))
        setValue('leverage', next, { shouldDirty: true, shouldValidate: true })
    }

    return (
        <div className="grid grid-cols-1 gap-5 rounded-lg bg-white/5 p-4 sm:p-6 lg:grid-cols-2">
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-neutral-50">Identity & scope</h2>
                <Separator />
            </div>

            {/* Row 1: Name, Symbol, Timeframe */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <InputField
                        name="name"
                        control={control}
                        label="Strategy Name"
                        placeholder="e.g. Momentum Breakout"
                        rules={{
                            required: 'Strategy name is required',
                            minLength: { value: 3, message: 'Min 3 characters' },
                            maxLength: { value: 100, message: 'Max 100 characters' },
                        }}
                        required
                    />
                </div>

                {/* Binance FAPI searchable symbol dropdown */}
                <SymbolSearchSelect label="Symbol" name="symbol" control={control} required />

                <FormSelect label="Timeframe" name="timeframe" control={control} options={TIMEFRAMES} required />
            </div>
            <div className="space-y-6">
                <div>
                    <div className="space-y-6 rounded-lg bg-white/5 p-5">
                        <h2 className="text-xl font-semibold text-neutral-50">Capital Allocation</h2>

                        <Separator />

                        <div className="space-y-5">
                            {/* Allocation Type */}
                            <FormSelect
                                label="Allocation Type"
                                name="capitalAllocationType"
                                control={control}
                                options={CAPITAL_ALLOCATION_TYPES}
                                required
                            />

                            {/* Allocation Value */}
                            <div className="space-y-4">
                                <InputField
                                    name="allocationValue"
                                    control={control}
                                    label={isPercentageAlloc ? 'Allocation Percentage (%)' : 'Allocation Amount (USD)'}
                                    type="number"
                                    placeholder={isPercentageAlloc ? 'e.g., 20' : 'e.g., 1000'}
                                    min={0.01}
                                    max={isPercentageAlloc ? 100 : undefined}
                                    step={isPercentageAlloc ? 0.01 : 1}
                                    rules={{
                                        required: 'Allocation value is required',
                                        min: { value: 0.01, message: 'Must be > 0' },
                                        ...(isPercentageAlloc && { max: { value: 100, message: 'Max 100%' } }),
                                    }}
                                />
                                <p className="text-sm font-medium text-neutral-300">
                                    Portfolio Allocation: 
                                    <span className="ml-2">
                                        {isPercentageAlloc && !balanceData ? (
                                            <span className="text-neutral-400 text-xs">
                                                (Fetching balance...)
                                            </span>
                                        ) : isPercentageAlloc ? (
                                            `${allocationValue}% of total portfolio ($${portfolioAllocation.toFixed(2)})`
                                        ) : (
                                            `$${portfolioAllocation.toFixed(2)}`
                                        )}
                                    </span>
                                </p>
                            </div>

                            {/* Leverage Count - Stepper */}
                            <div className="space-y-3">
                                <p className="text-xs text-neutral-200">Leverage Count</p>
                                <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                                    <button
                                        type="button"
                                        className="flex size-5 items-center justify-center"
                                        onClick={() => handleLeverageChange(-1)}
                                    >
                                        <span className="text-neutral-50">−</span>
                                    </button>
                                    <span className="text-sm font-medium text-neutral-100">
                                        {Number(leverage) || 0}X
                                    </span>
                                    <button
                                        type="button"
                                        className="flex size-5 items-center justify-center"
                                        onClick={() => handleLeverageChange(1)}
                                    >
                                        <span className="text-neutral-50">+</span>
                                    </button>
                                </div>
                                <div className="hidden">
                                    <InputField
                                        name="leverage"
                                        control={control}
                                        label=""
                                        type="number"
                                        placeholder="0"
                                        rules={{
                                            required: 'Leverage is required',
                                            min: { value: 1, message: 'Min 1' },
                                            max: { value: 125, message: 'Max 125' },
                                        }}
                                    />
                                </div>
                                <p className="text-sm font-medium text-neutral-300">
                                    Stepper Input: <span className="ml-2">0 - 125X</span>
                                </p>
                            </div>

                            {/* Position Sizing Method - Radio Buttons */}
                            <div className="space-y-4">
                                <p className="text-base text-neutral-50">Position Sizing Method</p>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="radio"
                                            value="FIXED"
                                            className={figmaRadioClass}
                                            {...control.register('positionSizingMethod')}
                                        />
                                        <span className="text-base text-neutral-50">Fixed amount</span>
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="radio"
                                            value="PERCENTAGE"
                                            className={figmaRadioClass}
                                            {...control.register('positionSizingMethod')}
                                        />
                                        <span className="text-base text-neutral-50">Percentage</span>
                                    </label>
                                </div>
                            </div>

                            {/* Trade Amount and Max Open Positions */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {positionSizingMethod === 'FIXED' && (
                                    <InputField
                                        name="fixedTradeAmount"
                                        control={control}
                                        label="Trade Amount (USD)"
                                        type="number"
                                        placeholder="e.g., 500"
                                        rules={{ required: 'Required', min: { value: 0.01, message: 'Min 0.01' } }}
                                    />
                                )}

                                {positionSizingMethod === 'PERCENTAGE' && (
                                    <InputField
                                        name="capitalPercentagePerTrade"
                                        control={control}
                                        label="Capital % Per Trade"
                                        type="number"
                                        placeholder="e.g., 10"
                                        rules={{
                                            required: 'Required',
                                            min: { value: 0.01, message: 'Min 0.01' },
                                            max: { value: 100, message: 'Max 100' },
                                        }}
                                    />
                                )}

                                <InputField
                                    name="maxOpenPositions"
                                    control={control}
                                    label="Max Open Positions"
                                    type="number"
                                    placeholder="e.g., 1"
                                    rules={{
                                        required: 'Required',
                                        min: { value: 1, message: 'Min 1' },
                                        max: { value: 100, message: 'Max 100' },
                                    }}
                                />
                            </div>

                            {/* Maximum Trade Duration */}
                            <Controller
                                name="maxTradeDuration"
                                control={control}
                                rules={{ required: 'Required', min: { value: 0, message: 'Must be ≥ 0' } }}
                                render={({ field, fieldState }) => {
                                    const multiplier = getDurationMultiplier(durationUnit)
                                    const secondsValue = Number(field.value ?? maxTradeDuration) || 0
                                    const unitValue = secondsValue / multiplier
                                    const inputValue = durationDraft ?? (secondsValue === 0 ? '' : String(unitValue))

                                    return (
                                        <div className="flex flex-col gap-2">
                                            <label className="font-medium text-neutral-50">
                                                Maximum Trade Duration
                                                <span className="ml-0.5 text-neutral-200">*</span>
                                            </label>

                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_150px]">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    step="any"
                                                    value={inputValue}
                                                    autoComplete="off"
                                                    onChange={(e) => {
                                                        const raw = e.target.value
                                                        setDurationDraft(raw)
                                                        if (raw === '') {
                                                            field.onChange(0)
                                                            return
                                                        }
                                                        const numeric = Number(raw)
                                                        if (Number.isNaN(numeric)) return
                                                        field.onChange(numeric * multiplier)
                                                    }}
                                                    onBlur={() => setDurationDraft(null)}
                                                    className="h-13 rounded-lg border border-transparent bg-white/10 px-4 text-neutral-200 transition-colors outline-none focus:border-blue-700"
                                                    placeholder="e.g., 1"
                                                />

                                                <Select
                                                    value={durationUnit}
                                                    onValueChange={(value: 'SECOND' | 'MINUTE' | 'HOUR') => {
                                                        setDurationUnit(value)
                                                        setDurationDraft(null)
                                                    }}
                                                >
                                                    <SelectTrigger className="h-13 w-full rounded-lg border-transparent bg-white/10 px-4 text-neutral-200 focus:border-blue-700">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="SECOND">Second</SelectItem>
                                                        <SelectItem value="MINUTE">Minute</SelectItem>
                                                        <SelectItem value="HOUR">Hour</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {fieldState.error && (
                                                <p className="text-xs leading-tight text-red-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </div>
                                    )
                                }}
                            />

                            {/* Trade Direction - Radio Buttons */}
                            <div className="space-y-4">
                                <p className="text-base text-neutral-50">Trade Direction *</p>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="radio"
                                            value="BUY"
                                            className={figmaRadioClass}
                                            {...control.register('tradeDirection')}
                                        />
                                        <span className="text-base text-neutral-50">Buy</span>
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="radio"
                                            value="SELL"
                                            className={figmaRadioClass}
                                            {...control.register('tradeDirection')}
                                        />
                                        <span className="text-base text-neutral-50">Sell</span>
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="radio"
                                            value="BOTH"
                                            className={figmaRadioClass}
                                            {...control.register('tradeDirection')}
                                        />
                                        <span className="text-base text-neutral-50">Both</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <RiskManagementSection control={control} watch={watch} />
                <StrategyExitsSection control={control} watch={watch} />
            </div>

            <IndicatorsSection control={control} watch={watch} />
        </div>
    )
}
