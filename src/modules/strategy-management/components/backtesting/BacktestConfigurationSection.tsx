import { Button } from '@/components/ui/button'
import { DateRangePicker, type DateRange } from '@/components/ui/DateRangePicker'
import Separator from '@/components/ui/Separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { INDICATOR_LABELS } from './constants'
import type { BacktestStatus, StrategyInfo } from './types'

type BacktestConfigurationSectionProps = {
    dateRange: DateRange
    backtestStatus: BacktestStatus
    isRunDisabled: boolean
    strategyData?: StrategyInfo
    activeIndicators: string[]
    stopLossText: string
    takeProfitText: string
    hasResults: boolean
    showSymbolTabs?: boolean // Optional: Controls whether to show symbol tabs
    onDateRangeChange: (range: DateRange) => void
    onRunBacktest: () => void
    onReset: () => void
}

export default function BacktestConfigurationSection({
    dateRange,
    backtestStatus,
    isRunDisabled,
    strategyData,
    activeIndicators,
    stopLossText,
    takeProfitText,
    hasResults,
    showSymbolTabs = true, // Default to true for backward compatibility
    onDateRangeChange,
    onRunBacktest,
    onReset,
}: BacktestConfigurationSectionProps) {
    const [activeTab, setActiveTab] = useState<string>('all')
    const tabSymbols = (() => {
        const symbolsValue = strategyData?.symbols
        if (Array.isArray(symbolsValue)) {
            return symbolsValue.filter((symbol): symbol is string => typeof symbol === 'string' && symbol.length > 0)
        }

        if (typeof symbolsValue === 'string' && symbolsValue.trim().length > 0) {
            return symbolsValue
                .split(',')
                .map((symbol) => symbol.trim())
                .filter((symbol) => symbol.length > 0)
        }

        return strategyData?.symbol ? [strategyData.symbol] : []
    })()

    return (
        <div>
            <div className="relative space-y-6 overflow-hidden rounded-xl bg-white/5 p-5 sm:p-6">
                <div className="pointer-events-none absolute -bottom-[20%] left-[50%] z-1 -translate-x-1/2">
                    <div className="h-200 w-200 rounded-full bg-linear-to-b from-blue-700 to-blue-800 blur-[500px]" />
                </div>

                <div className="relative z-1 space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-neutral-50">Backtest Configuration</h3>
                        <p className="mt-2 text-base text-neutral-200">
                            Choose the time period you want to test this strategy against
                        </p>
                    </div>

                    <Separator />

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

                    {!showSymbolTabs && (
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
                    )}

                    <div className="mt-4">
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
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={onRunBacktest}
                            disabled={isRunDisabled}
                            className="h-12 rounded-full px-8 text-base text-neutral-50 hover:bg-blue-600 disabled:opacity-50"
                        >
                            {backtestStatus === 'running' ? (
                                <div className="flex items-center gap-2">
                                    <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Running…
                                </div>
                            ) : hasResults ? (
                                'Re-run Backtest'
                            ) : (
                                'Run Backtest'
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

            {showSymbolTabs && (
                <>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="my-8 w-full">
                        <TabsList
                            className="grid w-full gap-5"
                            style={{
                                gridTemplateColumns: `repeat(${tabSymbols.length + 1}, minmax(0, 1fr))`,
                            }}
                        >
                            <TabsTrigger
                                value="all"
                                className="h-auto border-0 bg-transparent p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                            >
                                <Button variant={activeTab === 'all' ? 'default' : 'secondary'} className="w-full">
                                    All
                                </Button>
                            </TabsTrigger>
                            {tabSymbols.map((symbol) => (
                                <TabsTrigger
                                    key={symbol}
                                    value={symbol}
                                    className="h-auto border-0 bg-transparent p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                >
                                    <Button variant={activeTab === symbol ? 'default' : 'secondary'} className="w-full">
                                        {symbol.toUpperCase()}
                                    </Button>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </>
            )}
        </div>
    )
}
