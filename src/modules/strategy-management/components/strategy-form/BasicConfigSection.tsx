import FormSelect from '@/components/ui/FormSelect'
import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import SymbolSearchSelect from '@/components/ui/SymbolSearchSelect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounced } from '@/hooks/useDebounced'
import { cn } from '@/lib/utils'
import investorService, { type AllocationPreviewResponse } from '@/services/investorService'
import { InfoCircle } from 'iconsax-reactjs'
import { CirclePercent } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CAPITAL_ALLOCATION_TYPES, TIMEFRAMES } from '../../constants/strategy-form.defaults'
import type { StrategyFormData } from '../../types/strategy-form.types'
import IndicatorsSection from './IndicatorsSection'
import RiskManagementSection from './RiskManagementSection'

export default function BasicConfigSection() {
    const { control, watch, setValue } = useFormContext<StrategyFormData>()
    const capitalAllocationType = watch('capitalAllocationType')
    const allocationValue = watch('allocationValue')
    const positionSizingMethod = watch('positionSizingMethod')
    const leverage = watch('leverage')
    const maxTradeDuration = watch('maxTradeDuration')
    const maxPortfolioExposurePercentage = watch('maxPortfolioExposurePercentage')
    const fixedTradeAmount = watch('fixedTradeAmount')
    const capitalPercentagePerTrade = watch('capitalPercentagePerTrade')
    const maxOpenPositions = watch('maxOpenPositions')
    const symbols = watch('symbols')

    const isPercentageAlloc = capitalAllocationType === 'PERCENTAGE_OF_PORTFOLIO'
    const minimumAllocationValue = isPercentageAlloc ? 0.01 : 10
    const [durationUnit, setDurationUnit] = useState<'MINUTE' | 'HOUR' | 'DAY'>('MINUTE')
    const [durationDraft, setDurationDraft] = useState<string | null>(null)

    // ── FIX #1: Sync the exposure-limit toggle with form state ───────────────
    const [portfolioExposureLimitEnabled, setPortfolioExposureLimitEnabled] = useState(
        (maxPortfolioExposurePercentage ?? 0) > 0,
    )

    useEffect(() => {
        const isEnabled = (Number(maxPortfolioExposurePercentage) || 0) > 0
        setPortfolioExposureLimitEnabled((current) => (current === isEnabled ? current : isEnabled))
    }, [maxPortfolioExposurePercentage])
    // ── END FIX #1 ────────────────────────────────────────────────────────────

    const [exposureData, setExposureData] = useState<{
        totalExposure: number
        effectiveLeverage: number
    } | null>(null)
    const [allocationPreview, setAllocationPreview] = useState<AllocationPreviewResponse | null>(null)

    // ── FIX #4 (part A): Add previewError state ───────────────────────────────
    const [previewError, setPreviewError] = useState<string | null>(null)
    // ── END FIX #4 (part A) ───────────────────────────────────────────────────

    const lastPreviewRef = useRef<{ key: string; at: number }>({ key: '', at: 0 })
    const figmaRadioClass =
        'relative size-5 appearance-none rounded-full border border-blue-800 bg-transparent outline-none transition checked:border-blue-800 checked:bg-[radial-gradient(circle,_#6545ee_0_35%,_transparent_36%)] focus-visible:ring-2 focus-visible:ring-blue-800/50 cursor-pointer'

    // Calculate portfolio allocation
    const allocationBaseBalance = Number(allocationPreview?.availableBalance) || 0
    const portfolioAllocation = isPercentageAlloc
        ? (allocationBaseBalance * (Number(allocationValue) || 0)) / 100
        : Number(allocationValue) || 0
    const portfolioBalance = allocationBaseBalance
    const exposureLimitPercentage = Number(maxPortfolioExposurePercentage) || 0
    const maximumAllowedExposure =
        allocationPreview?.maxAllowedExposureAmount ?? portfolioBalance * (1 + exposureLimitPercentage / 100)

    // ── FIX #2: Only cap allocationValue when type flips to percentage ────────
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (isPercentageAlloc && Number(allocationValue) > 100) {
            setValue('allocationValue', 100, { shouldValidate: true })
        }
        // Intentionally depend only on the type flip. Adding allocationValue here
        // would re-introduce the typing-interference bug.
    }, [isPercentageAlloc, setValue])
    // ── END FIX #2 ────────────────────────────────────────────────────────────

    const previewInput = useMemo(
        () => ({
            capitalAllocationType,
            allocationValue: Number(allocationValue) || 0,
            leverage: Number(leverage) || 0,
            maxPortfolioExposurePercentage: portfolioExposureLimitEnabled
                ? Number(maxPortfolioExposurePercentage) || 0
                : 0,
            positionSizingMethod,
            fixedTradeAmount: Number(fixedTradeAmount) || 0,
            capitalPercentagePerTrade: Number(capitalPercentagePerTrade) || 0,
            maxOpenPositions: Number(maxOpenPositions) || 0,
            symbols: Array.isArray(symbols) ? symbols : [],
        }),
        [
            capitalAllocationType,
            allocationValue,
            leverage,
            portfolioExposureLimitEnabled,
            maxPortfolioExposurePercentage,
            positionSizingMethod,
            fixedTradeAmount,
            capitalPercentagePerTrade,
            maxOpenPositions,
            symbols,
        ],
    )

    const debouncedPreviewInput = useDebounced(previewInput, 1000)

    // ── FIX #4 (part B): Replace fetchExposureData useEffect ─────────────────
    useEffect(() => {
        const {
            capitalAllocationType: debouncedCapitalAllocationType,
            allocationValue: debouncedAllocationValue,
            leverage: debouncedLeverage,
            maxPortfolioExposurePercentage: debouncedMaxExposure,
            positionSizingMethod: debouncedPositionSizingMethod,
            fixedTradeAmount: debouncedFixedTradeAmount,
            capitalPercentagePerTrade: debouncedCapitalPercentagePerTrade,
            maxOpenPositions: debouncedMaxOpenPositions,
            symbols: debouncedSymbols,
        } = debouncedPreviewInput

        const minimumDebouncedAllocationValue =
            debouncedCapitalAllocationType === 'PERCENTAGE_OF_PORTFOLIO' ? 0.01 : 10

        const hasRequiredInput =
            debouncedCapitalAllocationType &&
            Number.isFinite(debouncedAllocationValue) &&
            debouncedAllocationValue >= minimumDebouncedAllocationValue

        if (!hasRequiredInput) {
            setAllocationPreview(null)
            setExposureData(null)
            setPreviewError(null)
            return
        }

        if (
            debouncedPositionSizingMethod === 'FIXED' &&
            (!Number.isFinite(debouncedFixedTradeAmount) || debouncedFixedTradeAmount <= 0)
        ) {
            setAllocationPreview(null)
            setExposureData(null)
            setPreviewError(null)
            return
        }

        if (
            debouncedPositionSizingMethod === 'PERCENTAGE' &&
            (!Number.isFinite(debouncedCapitalPercentagePerTrade) ||
                debouncedCapitalPercentagePerTrade <= 0 ||
                debouncedCapitalPercentagePerTrade > 100)
        ) {
            setAllocationPreview(null)
            setExposureData(null)
            setPreviewError(null)
            return
        }

        // Client-side dedup: skip if identical input was just requested.
        const requestKey = JSON.stringify(debouncedPreviewInput)
        if (requestKey === lastPreviewRef.current.key) {
            return
        }
        lastPreviewRef.current = { key: requestKey, at: Date.now() }

        let isActive = true

        const fetchExposureData = async () => {
            try {
                const response = await investorService.getAllocationPreview(
                    {
                        capitalAllocationType: debouncedCapitalAllocationType,
                        allocationValue: debouncedAllocationValue,
                        leverage: debouncedLeverage > 0 ? debouncedLeverage : undefined,
                        maxPortfolioExposurePercentage: debouncedMaxExposure,
                        positionSizingMethod: debouncedPositionSizingMethod,
                        fixedTradeAmount:
                            debouncedPositionSizingMethod === 'FIXED'
                                ? debouncedFixedTradeAmount
                                : undefined,
                        capitalPercentagePerTrade:
                            debouncedPositionSizingMethod === 'PERCENTAGE'
                                ? debouncedCapitalPercentagePerTrade
                                : undefined,
                        maxOpenPositions:
                            debouncedMaxOpenPositions > 0 ? debouncedMaxOpenPositions : undefined,
                        symbols: debouncedSymbols,
                    },
                    'live',
                )

                if (!isActive) return

                setAllocationPreview(response)
                setExposureData({
                    totalExposure: response.projectedEntryNotional,
                    effectiveLeverage: response.leverage,
                })
                setPreviewError(null)
            } catch (error) {
                if (!isActive) return

                // Surface the error instead of silently computing fake values.
                // No fallback math — stale/incorrect exposure numbers are worse
                // than an explicit error message in a form that allocates capital.
                console.error('Failed to fetch allocation preview:', error)
                setAllocationPreview(null)
                setExposureData(null)
                setPreviewError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to calculate allocation preview. Check your connection and try again.',
                )
            }
        }

        fetchExposureData()

        return () => {
            isActive = false
        }
        // Only depend on the debounced input. `leverage` and `portfolioAllocation`
        // were redundant — leverage is already inside debouncedPreviewInput, and
        // portfolioAllocation was only used by the removed fallback.
    }, [debouncedPreviewInput])
    // ── END FIX #4 (part B) ───────────────────────────────────────────────────

    const dynamicLimits = useMemo(() => {
        const defaults = {
            maxLeverage: 125,
            maxOpenPositions: 100,
            maxFixedTradeAmount: undefined as number | undefined,
            maxCapitalPercentagePerTrade: 100,
        }

        const limits = allocationPreview?.positionSizingLimits
        if (!limits) return defaults

        return {
            maxLeverage: limits.maxLeverageAllowed ?? defaults.maxLeverage,
            maxOpenPositions: limits.maxOpenPositionsAllowed ?? defaults.maxOpenPositions,
            maxFixedTradeAmount:
                limits.maxFixedTradeAmountAllowed === null
                    ? undefined
                    : limits.maxFixedTradeAmountAllowed,
            maxCapitalPercentagePerTrade:
                limits.maxCapitalPercentagePerTradeAllowed ?? defaults.maxCapitalPercentagePerTrade,
        }
    }, [allocationPreview])

    // ── FIX #3: Replace blind echo-back useEffect with explicit clamp ─────────
    useEffect(() => {
        // Only act when the preview has returned real limits.
        if (!allocationPreview?.positionSizingLimits) return

        const currentLeverage = Number(leverage) || 0
        if (currentLeverage > dynamicLimits.maxLeverage) {
            setValue('leverage', dynamicLimits.maxLeverage, {
                shouldValidate: true,
                shouldDirty: true,
            })
        }

        const currentMaxPositions = Number(maxOpenPositions) || 0
        if (currentMaxPositions > dynamicLimits.maxOpenPositions) {
            setValue('maxOpenPositions', dynamicLimits.maxOpenPositions, {
                shouldValidate: true,
                shouldDirty: true,
            })
        }

        if (positionSizingMethod === 'FIXED' && dynamicLimits.maxFixedTradeAmount !== undefined) {
            const currentFixed = Number(fixedTradeAmount) || 0
            if (currentFixed > dynamicLimits.maxFixedTradeAmount) {
                setValue('fixedTradeAmount', dynamicLimits.maxFixedTradeAmount, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
            }
        }

        if (positionSizingMethod === 'PERCENTAGE') {
            const currentPercent = Number(capitalPercentagePerTrade) || 0
            if (currentPercent > dynamicLimits.maxCapitalPercentagePerTrade) {
                setValue('capitalPercentagePerTrade', dynamicLimits.maxCapitalPercentagePerTrade, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
            }
        }
    }, [
        allocationPreview,
        dynamicLimits,
        leverage,
        maxOpenPositions,
        fixedTradeAmount,
        capitalPercentagePerTrade,
        positionSizingMethod,
        setValue,
    ])
    // ── END FIX #3 ────────────────────────────────────────────────────────────

    const getDurationMultiplier = (unit: 'MINUTE' | 'HOUR' | 'DAY') => {
        if (unit === 'HOUR') return 3600
        if (unit === 'DAY') return 86400
        return 60
    }

    const handleLeverageChange = (delta: number) => {
        const current = Number(leverage) || 0
        const maxLeverageLimit = dynamicLimits.maxLeverage || 125
        const next = Math.min(maxLeverageLimit, Math.max(1, current + delta))
        setValue('leverage', next, { shouldDirty: true, shouldValidate: true })
    }

    return (
        <div className="grid grid-cols-1 gap-5 rounded-lg bg-white/5 p-4 sm:p-6 lg:grid-cols-2">

            {/* Row 1: Name, Symbol, Timeframe */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
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
                <SymbolSearchSelect label="Trading Pair" name="symbols" control={control} required />

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
                                    min={minimumAllocationValue}
                                    max={isPercentageAlloc ? 100 : undefined}
                                    step={0.01}
                                    rules={{
                                        required: 'Allocation value is required',
                                        min: {
                                            value: minimumAllocationValue,
                                            message: isPercentageAlloc ? 'Must be > 0' : 'Minimum is $10',
                                        },
                                        ...(isPercentageAlloc && { max: { value: 100, message: 'Max 100%' } }),
                                    }}
                                />
                                <p className="text-sm font-medium text-neutral-300">
                                    Portfolio Allocation:
                                    <span className="ml-2">
                                        {isPercentageAlloc && allocationBaseBalance === 0 ? (
                                            <span className="text-neutral-400">
                                                Waiting for allocation preview
                                            </span>
                                        ) : isPercentageAlloc ? (
                                            `${allocationValue}% of available balance ($${portfolioAllocation.toFixed(2)})`
                                        ) : (
                                            `$${portfolioAllocation.toFixed(2)}`
                                        )}
                                    </span>
                                </p>
                            </div>

                            {/* Max Portfolio Exposure Percentage */}
                            <div className="space-y-3">
                                <Separator />

                                {/* Portfolio Exposure Limit Toggle */}
                                <div className="flex items-center justify-between">
                                    <label className="text-base font-medium text-neutral-50">
                                        Portfolio Exposure Limit
                                    </label>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={portfolioExposureLimitEnabled}
                                            onChange={(e) => {
                                                const isEnabled = e.target.checked
                                                setPortfolioExposureLimitEnabled(isEnabled)
                                                if (!isEnabled) {
                                                    setValue('maxPortfolioExposurePercentage', 0, {
                                                        shouldValidate: false,
                                                    })
                                                } else {
                                                    setValue('maxPortfolioExposurePercentage', 3000, {
                                                        shouldValidate: true,
                                                    })
                                                }
                                            }}
                                            className="peer sr-only"
                                        />
                                        <div
                                            className={cn(
                                                'relative h-5 w-9 rounded-full transition-all duration-300',
                                                portfolioExposureLimitEnabled ? 'bg-blue-700' : 'bg-neutral-600',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300',
                                                    portfolioExposureLimitEnabled
                                                        ? 'translate-x-4'
                                                        : 'translate-x-0',
                                                )}
                                            />
                                        </div>
                                    </label>
                                </div>

                                {portfolioExposureLimitEnabled && (
                                    <>
                                        <div className="space-y-2 rounded-lg bg-neutral-900 p-4">
                                            <Controller
                                                name="maxPortfolioExposurePercentage"
                                                control={control}
                                                rules={{
                                                    required: 'Max portfolio exposure is required',
                                                    min: { value: 1, message: 'Minimum is 1%' },
                                                    max: { value: 10000, message: 'Maximum is 10000%' },
                                                }}
                                                render={({ field, fieldState }) => (
                                                    <div className="space-y-2">
                                                        <label className="text-base leading-[21px] font-normal text-neutral-50">
                                                            Max Exposure *
                                                        </label>
                                                        <div className="flex h-12 items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                                                            <div className="flex items-center gap-3">
                                                                <CirclePercent
                                                                    size={20}
                                                                    className="text-neutral-300"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    min={1}
                                                                    max={10000}
                                                                    step={1}
                                                                    autoComplete="off"
                                                                    value={field.value ?? ''}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                                                            e.preventDefault()
                                                                        }
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        field.onBlur()
                                                                        // On blur, if empty, reset to minimum valid value
                                                                        if (e.target.value === '') {
                                                                            field.onChange(1)
                                                                        }
                                                                    }}
                                                                    onChange={(e) => {
                                                                        const rawValue = e.target.value
                                                                        // Allow empty string for typing
                                                                        if (rawValue === '') {
                                                                            field.onChange('')
                                                                            return
                                                                        }
                                                                        const nextValue = Number(rawValue)
                                                                        field.onChange(
                                                                            Number.isNaN(nextValue) ? '' : nextValue,
                                                                        )
                                                                    }}
                                                                    placeholder="e.g., 3000"
                                                                    className="w-full border-none bg-transparent text-base leading-[21px] font-normal text-neutral-300 outline-none"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => field.onChange(10000)}
                                                                className="text-base leading-[21px] font-semibold text-blue-500"
                                                            >
                                                                Max
                                                            </button>
                                                        </div>
                                                        {fieldState.error && (
                                                            <p className="text-xs leading-tight text-red-500">
                                                                {fieldState?.error?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        {/* Calculated Exposure Display */}
                                        {exposureData && (
                                            <div className="space-y-3 rounded-lg bg-white/8 px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <InfoCircle size="16" className="shrink-0 text-blue-700" />
                                                    <p className="text-sm leading-[18px] text-neutral-200">
                                                        Total exposure includes all active trades across all
                                                        selected assets and leverage
                                                    </p>
                                                </div>

                                                <div className="space-y-2 text-base leading-[21px]">
                                                    <p className="font-semibold text-neutral-50">
                                                        Available Balance: ${' '}
                                                        {portfolioBalance?.toLocaleString('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </p>
                                                    <p className="text-neutral-400">
                                                        Max Exposure: {exposureLimitPercentage}%
                                                        <br />
                                                        Maximum Allowed Exposure: ${' '}
                                                        {maximumAllowedExposure?.toLocaleString('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                <Separator />
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
                                        step={0.01}
                                        max={dynamicLimits.maxFixedTradeAmount}
                                        rules={{
                                            required: 'Required',
                                            min: { value: 0.01, message: 'Min 0.01' },
                                            ...(dynamicLimits.maxFixedTradeAmount
                                                ? {
                                                      max: {
                                                          value: dynamicLimits.maxFixedTradeAmount,
                                                          message: `Max ${dynamicLimits.maxFixedTradeAmount.toFixed(2)}`,
                                                      },
                                                  }
                                                : {}),
                                        }}
                                    />
                                )}

                                {positionSizingMethod === 'PERCENTAGE' && (
                                    <InputField
                                        name="capitalPercentagePerTrade"
                                        control={control}
                                        label="Capital % Per Trade"
                                        type="number"
                                        placeholder="e.g., 10"
                                        step={0.01}
                                        max={dynamicLimits.maxCapitalPercentagePerTrade}
                                        rules={{
                                            required: 'Required',
                                            min: { value: 0.01, message: 'Min 0.01' },
                                            max: {
                                                value: dynamicLimits.maxCapitalPercentagePerTrade,
                                                message: `Max ${dynamicLimits.maxCapitalPercentagePerTrade.toFixed(2)}`,
                                            },
                                        }}
                                    />
                                )}

                                <InputField
                                    name="maxOpenPositions"
                                    control={control}
                                    label="Max Open Positions"
                                    type="number"
                                    placeholder="e.g., 1"
                                    max={dynamicLimits.maxOpenPositions}
                                    rules={{
                                        required: 'Required',
                                        min: { value: 1, message: 'Min 1' },
                                        max: {
                                            value: dynamicLimits.maxOpenPositions,
                                            message: `Max ${dynamicLimits.maxOpenPositions}`,
                                        },
                                    }}
                                />
                            </div>

                            {/* Leverage Count - Stepper */}
                            <div className="space-y-3">
                                <p className="font-medium text-neutral-50">Leverage Count</p>
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
                                            max: {
                                                value: dynamicLimits.maxLeverage || 125,
                                                message: `Max ${dynamicLimits.maxLeverage.toFixed(2)}X`,
                                            },
                                        }}
                                    />
                                </div>
                                <p className="text-sm font-medium text-neutral-300">
                                    Stepper Input:{' '}
                                    <span className="ml-2">0 - {dynamicLimits.maxLeverage.toFixed(2)}X</span>
                                </p>
                            </div>

                            {allocationPreview?.positionSizing && (
                                <div className="space-y-3 rounded-lg bg-white/8 px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <InfoCircle size="16" className="shrink-0 text-blue-700" />
                                        <p className="text-sm leading-[18px] text-neutral-200">
                                            Limits are based on allocation size, fees, leverage, and selected symbols.
                                        </p>
                                    </div>
                                    <div className="space-y-2 text-sm leading-[18px] text-neutral-300">
                                        <p>
                                            Per trade amount:{' '}
                                            <span className="font-semibold text-neutral-50">
                                                ${allocationPreview.positionSizing.tradeAmountPerPosition.toFixed(2)}
                                            </span>
                                            {' '}| Usable after fee:{' '}
                                            <span className="font-semibold text-neutral-50">
                                                ${allocationPreview.positionSizing.usableAmountPerPosition.toFixed(2)}
                                            </span>
                                        </p>
                                        <p>
                                            Total capital required ({allocationPreview.positionSizing.maxOpenPositions} positions):{' '}
                                            <span className="font-semibold text-neutral-50">
                                                ${allocationPreview.positionSizing.totalCapitalRequired.toFixed(2)}
                                            </span>
                                        </p>
                                        <p>
                                            Total exposure ({allocationPreview.positionSizing.maxOpenPositions} positions):{' '}
                                            <span className="font-semibold text-neutral-50">
                                                ${allocationPreview.positionSizing.totalExposureAllPositions.toFixed(2)}
                                            </span>
                                        </p>
                                        <p>
                                            Max leverage allowed: <span className="font-semibold text-neutral-50">
                                                {dynamicLimits.maxLeverage.toFixed(2)}X
                                            </span>
                                            {' '}| Max open positions: <span className="font-semibold text-neutral-50">
                                                {dynamicLimits.maxOpenPositions}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── FIX #4 (part C): Preview error display ───────── */}
                            {previewError && (
                                <div className="space-y-1 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <InfoCircle size="16" className="shrink-0 text-red-400" />
                                        <p className="text-sm font-medium text-red-300">Allocation preview unavailable</p>
                                    </div>
                                    <p className="text-xs text-red-200/80">{previewError}</p>
                                </div>
                            )}
                            {/* ── END FIX #4 (part C) ──────────────────────────── */}

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
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                                            e.preventDefault()
                                                        }
                                                    }}
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
                                                    onValueChange={(value: 'MINUTE' | 'HOUR' | 'DAY') => {
                                                        setDurationUnit(value)
                                                        setDurationDraft(null)
                                                    }}
                                                >
                                                    <SelectTrigger className="h-13 w-full rounded-lg border-transparent bg-white/10 px-4 text-neutral-200 focus:border-blue-700">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="MINUTE">Minute</SelectItem>
                                                        <SelectItem value="HOUR">Hour</SelectItem>
                                                        <SelectItem value="DAY">Day</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {fieldState.error && (
                                                <p className="text-xs leading-tight text-red-500">
                                                    {fieldState?.error?.message}
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

                <RiskManagementSection />
            </div>

            <IndicatorsSection />
        </div>
    )
}