import { Button } from '@/components/ui/button'
import { DateRangePicker, type DateRange } from '@/components/ui/DateRangePicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Separator from '@/components/ui/Separator'
import { INDICATOR_LABELS, TRADING_ASSETS } from './constants'
import type { BacktestStatus, StrategyInfo } from './types'

type BacktestConfigurationSectionProps = {
    selectedAsset: string
    dateRange: DateRange
    backtestStatus: BacktestStatus
    isRunDisabled: boolean
    strategyData?: StrategyInfo
    activeIndicators: string[]
    stopLossText: string
    takeProfitText: string
    hasResults: boolean
    onAssetChange: (value: string) => void
    onDateRangeChange: (range: DateRange) => void
    onRunBacktest: () => void
    onReset: () => void
}

export default function BacktestConfigurationSection({
    selectedAsset,
    dateRange,
    backtestStatus,
    isRunDisabled,
    strategyData,
    activeIndicators,
    stopLossText,
    takeProfitText,
    hasResults,
    onAssetChange,
    onDateRangeChange,
    onRunBacktest,
    onReset,
}: BacktestConfigurationSectionProps) {
    return (
        <div className="relative space-y-6 overflow-hidden rounded-xl bg-white/5 p-5 sm:p-6">
            <div className="pointer-events-none absolute -bottom-[20%] left-[50%] z-1 -translate-x-1/2">
                <div className="h-200 w-200 rounded-full bg-linear-to-b from-blue-700 to-blue-800 blur-[500px]" />
            </div>

            <div className="relative z-1 space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-neutral-50">Backtest Configuration</h3>
                    <p className="mt-2 text-base text-neutral-200">
                        Choose the market and time period you want to test this strategy against
                    </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-base text-neutral-50">
                            Trading Asset <span className="text-neutral-200">*</span>
                        </label>
                        <Select value={selectedAsset} onValueChange={onAssetChange} disabled>
                            <SelectTrigger className="h-12 rounded-lg border-transparent bg-white/10 text-base text-neutral-300 focus:border-blue-700 opacity-60 cursor-not-allowed">
                                <SelectValue placeholder="Select trading asset" />
                            </SelectTrigger>
                            <SelectContent>
                                {TRADING_ASSETS.map((pair) => (
                                    <SelectItem key={pair} value={pair}>
                                        {pair}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-base text-neutral-50">
                            Date Range Picker <span className="text-neutral-200">*</span>
                        </label>
                        <DateRangePicker
                            align="start"
                            onUpdate={({ range }) => onDateRangeChange(range)}
                            initialDateFrom={dateRange.from}
                            initialDateTo={dateRange.to}
                            triggerClassName="h-12 w-full justify-between rounded-lg border-transparent bg-white/10 px-3 text-base text-neutral-300 hover:bg-white/10"
                        />
                    </div>
                </div>

                <div className="rounded-lg bg-white/5 px-4 py-4 sm:px-6 sm:py-5">
                    <div className="space-y-3 text-lg leading-6">
                        <div className="flex items-center gap-3">
                            <span className="font-medium text-neutral-300">Timeframe:</span>
                            <span className="font-bold text-neutral-50">{strategyData?.timeframe ?? '—'}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="font-medium text-neutral-300">Indicators:</span>
                            {activeIndicators.length > 0 ? (
                                activeIndicators.map((indicator) => (
                                    <span
                                        key={indicator}
                                        className="rounded-full bg-white/10 px-3 py-1 text-lg leading-6 font-bold text-neutral-50"
                                    >
                                        {INDICATOR_LABELS[indicator] ?? indicator.toUpperCase()}
                                    </span>
                                ))
                            ) : (
                                <span className="font-bold text-neutral-50">—</span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="font-medium text-neutral-300">Stop-Loss:</span>
                            <span className="font-bold text-neutral-50">{stopLossText}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="font-medium text-neutral-300">Take-Profit:</span>
                            <span className="font-bold text-neutral-50">{takeProfitText}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                    <Button
                        onClick={onRunBacktest}
                        disabled={isRunDisabled}
                        className="h-12 rounded-full px-8 text-base text-neutral-50 hover:bg-blue-600 disabled:opacity-50"
                    >
                        {backtestStatus === 'running' ? (
                            <div className='flex items-center gap-2'>
                                <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Running…
                            </div>
                        ) : (
                            hasResults ? 'Re-run Backtest' : 'Run Backtest'
                        )}
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={onReset}
                        className="h-12 rounded-full border border-white/30 bg-transparent px-8 text-base text-neutral-50 hover:bg-white/10"
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    )
}
