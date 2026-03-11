import type { DateRange } from '@/components/ui/DateRangePicker'
import { useState } from 'react'
import BacktestConfigurationSection from './backtesting/BacktestConfigurationSection'
import BacktestLoadingState from './backtesting/BacktestLoadingState'
import BacktestResultsSection from './backtesting/BacktestResultsSection'
import { MOCK_EQUITY_CURVE, MOCK_RESULTS } from './backtesting/constants'
import type { BacktestStatus, StrategyInfo } from './backtesting/types'

type BacktestingTabProps = {
    strategyData?: StrategyInfo
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function BacktestingTab({ strategyData }: BacktestingTabProps) {
    const [selectedAsset, setSelectedAsset] = useState<string>(strategyData?.symbol ?? '')
    const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
    const [backtestStatus, setBacktestStatus] = useState<BacktestStatus>('idle')
    const [hasResults, setHasResults] = useState(false)

    const activeIndicators = strategyData?.indicators
        ? Object.entries(strategyData.indicators)
              .filter(([, v]) => v && v.role !== 'disabled')
              .map(([k]) => k)
        : []

    const stopLoss = strategyData?.risk?.stopLoss
    const takeProfit = strategyData?.risk?.takeProfit
    const isRunDisabled = !selectedAsset || !dateRange.from || !dateRange.to || backtestStatus === 'running'

    const stopLossText = stopLoss
        ? stopLoss.type === 'FIXED_PERCENTAGE'
            ? `${stopLoss.fixedPercentage}%`
            : stopLoss.type === 'TRAILING'
              ? 'Trailing'
              : `Structural (${stopLoss.structuralLookback} bars)`
        : '—'

    const takeProfitText = takeProfit
        ? takeProfit.type === 'FIXED_PERCENTAGE'
            ? `${takeProfit.fixedPercentage}%`
            : takeProfit.type === 'RISK_REWARD'
              ? 'Risk–Reward'
              : 'Multi-level'
        : '—'

    const handleRunBacktest = () => {
        if (isRunDisabled) return
        setBacktestStatus('running')
        setHasResults(false)
        // TODO: Replace with real API call to POST /backtest
        setTimeout(() => {
            setBacktestStatus('completed')
            setHasResults(true)
        }, 3000)
    }

    const handleReset = () => {
        setSelectedAsset(strategyData?.symbol ?? '')
        setDateRange({ from: undefined, to: undefined })
        setBacktestStatus('idle')
        setHasResults(false)
    }

    return (
        <div className="space-y-6">
            <BacktestConfigurationSection
                selectedAsset={selectedAsset}
                dateRange={dateRange}
                backtestStatus={backtestStatus}
                isRunDisabled={isRunDisabled}
                strategyData={strategyData}
                activeIndicators={activeIndicators}
                stopLossText={stopLossText}
                takeProfitText={takeProfitText}
                onAssetChange={setSelectedAsset}
                onDateRangeChange={setDateRange}
                onRunBacktest={handleRunBacktest}
                onReset={handleReset}
            />

            {backtestStatus === 'running' && <BacktestLoadingState />}

            {hasResults && backtestStatus === 'completed' && (
                <BacktestResultsSection
                    activeIndicators={activeIndicators}
                    results={MOCK_RESULTS}
                    equityCurve={MOCK_EQUITY_CURVE}
                />
            )}
        </div>
    )
}
