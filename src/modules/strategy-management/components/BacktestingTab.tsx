import type { DateRange } from '@/components/ui/DateRangePicker'
import { formatEquityCurve, formatTradeDuration } from '@/lib/formatBacktestData'
import type { BacktestData } from '@/services/backtestService'
import { getBacktestStatus, pollBacktestStatus, startBacktest } from '@/services/backtestService'
import { useEffect, useState } from 'react'
import BacktestConfigurationSection from './backtesting/BacktestConfigurationSection'
import BacktestLoadingState from './backtesting/BacktestLoadingState'
import BacktestResultsSection from './backtesting/BacktestResultsSection'
import type { BacktestResult, BacktestStatus, EquityCurvePoint, StrategyInfo } from './backtesting/types'

type BacktestingTabProps = {
    strategyData?: StrategyInfo
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function BacktestingTab({ strategyData }: BacktestingTabProps) {
    const [selectedAsset, setSelectedAsset] = useState<string>(strategyData?.symbol ?? '')
    const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
    const [backtestStatus, setBacktestStatus] = useState<BacktestStatus>('idle')
    const [hasResults, setHasResults] = useState(false)
    const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null)
    const [equityCurve, setEquityCurve] = useState<EquityCurvePoint[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

    const transformBacktestData = (data: BacktestData): BacktestResult => {
        const metrics = data.metrics!
        const initialCapital = data.equityCurve[0]?.equity ?? 1000
        const netProfitPct = (metrics.netProfit / initialCapital) * 100

        return {
            netProfit: metrics.netProfit,
            netProfitPct,
            winRate: metrics.winRate,
            sharpeRatio: metrics.sharpeRatio,
            totalTrades: metrics.totalTrades,
            averageWin: metrics.averageWin,
            averageLoss: metrics.averageLoss,
            expectancy: metrics.expectancy,
            maxDrawdown: metrics.maxDrawdown,
            timeInMarket: metrics.timeInMarket,
            avgTradeDuration: formatTradeDuration(metrics.averageTradeDurationMinutes),
            longTrades: metrics.longTrades,
            shortTrades: metrics.shortTrades,
            exposureRatio: metrics.timeInMarket, // Using timeInMarket as exposureRatio
            winningTrades: metrics.winningTrades,
            losingTrades: metrics.losingTrades,
            profitFactor: metrics.profitFactor,
            maxConsecutiveWins: metrics.maxConsecutiveWins,
            maxConsecutiveLosses: metrics.maxConsecutiveLosses,
        }
    }

    const handleRunBacktest = async () => {
        if (isRunDisabled || !strategyData?._id || !dateRange.from || !dateRange.to) return

        try {
            setHasResults(false)
            setErrorMessage(null)

            // Format dates to ISO strings
            const startDate = new Date(dateRange.from).toISOString()
            const endDate = new Date(dateRange.to).toISOString()

            // Start the backtest (API responds immediately)
            const startResponse = await startBacktest(strategyData._id, startDate, endDate)

            // Show running status immediately after backtest starts
            setBacktestStatus('running')

            // Poll for completion in the background
            const backtestData = await pollBacktestStatus(startResponse.data.instanceId, (status) => {
                console.log('Backtest status:', status)
            })

            // Transform and set results
            const transformedResults = transformBacktestData(backtestData)
            const formattedEquityCurve = formatEquityCurve(backtestData.equityCurve, 'date')

            setBacktestResults(transformedResults)
            setEquityCurve(formattedEquityCurve)
            setBacktestStatus('completed')
            setHasResults(true)
        } catch (error) {
            console.error('Backtest error:', error)
            setBacktestStatus('failed')
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred during backtesting')
            setHasResults(false)
        }
    }

    const handleReset = () => {
        setSelectedAsset(strategyData?.symbol ?? '')
        setDateRange({ from: undefined, to: undefined })
        setBacktestStatus('idle')
        setHasResults(false)
        setBacktestResults(null)
        setEquityCurve([])
        setErrorMessage(null)
    }

    // Fetch existing backtest results on mount
    useEffect(() => {
        const fetchExistingBacktest = async () => {
            if (!strategyData?._id) return

            try {
                const response = await getBacktestStatus(strategyData._id)
                const backtestData = response.data.backtest

                // Only show results if backtest is completed
                if (backtestData.status === 'COMPLETED' && backtestData.metrics && backtestData.equityCurve.length > 0) {
                    const transformedResults = transformBacktestData(backtestData)
                    const formattedEquityCurve = formatEquityCurve(backtestData.equityCurve, 'date')

                    setBacktestResults(transformedResults)
                    setEquityCurve(formattedEquityCurve)
                    setBacktestStatus('completed')
                    setHasResults(true)

                    // Optionally set the date range from the existing backtest
                    if (backtestData.startDate && backtestData.endDate) {
                        setDateRange({
                            from: new Date(backtestData.startDate),
                            to: new Date(backtestData.endDate),
                        })
                    }
                } else if (backtestData.status === 'RUNNING' || backtestData.status === 'PENDING') {
                    // If backtest is still running, poll for completion
                    setBacktestStatus('running')
                    const completedData = await pollBacktestStatus(strategyData._id)
                    const transformedResults = transformBacktestData(completedData)
                    const formattedEquityCurve = formatEquityCurve(completedData.equityCurve, 'date')

                    setBacktestResults(transformedResults)
                    setEquityCurve(formattedEquityCurve)
                    setBacktestStatus('completed')
                    setHasResults(true)
                }
            } catch (error) {
                // No existing backtest found or error fetching - this is okay, user can run a new one
                console.log('No existing backtest found or error:', error)
            }
        }

        fetchExistingBacktest()
    }, [strategyData?._id])

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
                hasResults={hasResults}
                onAssetChange={setSelectedAsset}
                onDateRangeChange={setDateRange}
                onRunBacktest={handleRunBacktest}
                onReset={handleReset}
            />

            {backtestStatus === 'running' && <BacktestLoadingState />}

            {backtestStatus === 'failed' && errorMessage && (
                <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
                    <p className="font-semibold">Backtest Failed</p>
                    <p className="text-sm">{errorMessage}</p>
                </div>
            )}

            {hasResults && backtestStatus === 'completed' && backtestResults && equityCurve.length > 0 && (
                <BacktestResultsSection
                    activeIndicators={activeIndicators}
                    results={backtestResults}
                    equityCurve={equityCurve}
                />
            )}
        </div>
    )
}
