import type { DateRange } from '@/components/ui/DateRangePicker'
import { formatEquityCurve, formatTradeDuration } from '@/lib/formatBacktestData'
import type { BacktestData } from '@/services/backtestService'
import { getBacktestStatus, pollBacktestStatus, startBacktest } from '@/services/backtestService'
import { AxiosError } from 'axios'
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
    const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
    const [backtestStatus, setBacktestStatus] = useState<BacktestStatus>('idle')
    const [hasResults, setHasResults] = useState(false)
    const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null)
    const [equityCurve, setEquityCurve] = useState<EquityCurvePoint[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [activeSymbol, setActiveSymbol] = useState('all')
    const [backtestData, setBacktestData] = useState<BacktestData | null>(null)

    const activeIndicators = strategyData?.indicators
        ? Object.entries(strategyData.indicators)
              .filter(([, v]) => v && v.role !== 'disabled')
              .map(([k]) => k)
        : []

    const stopLoss = strategyData?.risk?.stopLoss
    const takeProfit = strategyData?.risk?.takeProfit
    const isRunDisabled = !dateRange.from || !dateRange.to || backtestStatus === 'running'

    const stopLossText = stopLoss
        ? stopLoss.type === 'FIXED_PERCENTAGE'
            ? `${stopLoss.fixedPercentage}%`
            : stopLoss.type === 'TRAILING'
              ? 'Trailing'
                            : `Structural (${stopLoss.structuralLookback} bars${stopLoss.structuralBufferPercent != null ? `, buffer ${stopLoss.structuralBufferPercent}%` : ''}${stopLoss.structuralMaxDistancePercent != null ? `, max ${stopLoss.structuralMaxDistancePercent}%` : ''})`
        : '—'

    const takeProfitText = takeProfit
        ? takeProfit.type === 'FIXED_PERCENTAGE'
            ? `${takeProfit.fixedPercentage}%`
            : takeProfit.type === 'RISK_REWARD'
              ? 'Risk–Reward'
              : 'Multi-level'
        : '—'

    const getBreakdownByKey = (data: BacktestData, key: string) =>
        data.breakdown.find((item) => item.key === key) ?? null

    const transformBacktestData = (data: BacktestData, breakdownKey: string): BacktestResult => {
        const breakdown = getBreakdownByKey(data, breakdownKey)
        if (!breakdown) {
            throw new Error(`Backtest breakdown is missing for ${breakdownKey}`)
        }
        const initialCapital = data.initialCapital || breakdown.equityCurve?.[0]?.equity || 1000
        const netProfitPct = (breakdown.netProfit / initialCapital) * 100

        return {
            netProfit: breakdown.netProfit,
            netProfitPct,
            winRate: breakdown.winRate,
            sharpeRatio: breakdown.sharpeRatio,
            totalTrades: breakdown.totalTrades,
            averageWin: breakdown.averageWin,
            averageLoss: breakdown.averageLoss,
            expectancy: breakdown.expectancy,
            maxDrawdown: breakdown.maxDrawdown,
            timeInMarket: breakdown.timeInMarket,
            avgTradeDuration: formatTradeDuration(breakdown.averageTradeDurationMinutes),
            longTrades: breakdown.longTrades,
            shortTrades: breakdown.shortTrades,
            exposureRatio: breakdown.timeInMarket,
            winningTrades: breakdown.winningTrades,
            losingTrades: breakdown.losingTrades,
            profitFactor: breakdown.profitFactor,
            maxConsecutiveWins: breakdown.maxConsecutiveWins,
            maxConsecutiveLosses: breakdown.maxConsecutiveLosses,
        }
    }

    const extractBacktestErrorMessage = (error: unknown): string => {
        if (error instanceof AxiosError) {
            const responseMessage = error.response?.data?.data?.message || error.response?.data?.message
            if (typeof responseMessage === 'string' && responseMessage.trim()) {
                return responseMessage
            }
        }

        if (error instanceof Error && error.message.trim()) {
            return error.message
        }

        return 'An error occurred during backtesting'
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
            const backtestData = await pollBacktestStatus(startResponse?.instanceId, (status) => {
                console.log('Backtest status:', status)
            })
            setBacktestData(backtestData)
            setBacktestStatus('completed')
        } catch (error) {
            console.error('Backtest error:', error)
            setBacktestStatus('failed')
            setErrorMessage(extractBacktestErrorMessage(error))
            setHasResults(false)
        }
    }

    const handleReset = () => {
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
                const backtestData = response?.backtest

                // Only show results if backtest is completed
                if (backtestData?.status === 'COMPLETED') {
                    setBacktestData(backtestData)
                    setBacktestStatus('completed')

                    // Optionally set the date range from the existing backtest
                    if (backtestData?.startDate && backtestData?.endDate) {
                        setDateRange({
                            from: new Date(backtestData.startDate),
                            to: new Date(backtestData.endDate),
                        })
                    }
                } else if (backtestData?.status === 'RUNNING' || backtestData?.status === 'PENDING') {
                    // If backtest is still running, poll for completion
                    setBacktestStatus('running')
                    const completedData = await pollBacktestStatus(strategyData._id)
                    setBacktestData(completedData)
                    setBacktestStatus('completed')
                } else if (backtestData?.status === 'FAILED') {
                    setBacktestStatus('failed')
                    setHasResults(false)
                    setBacktestResults(null)
                    setEquityCurve([])
                    setErrorMessage(backtestData.errorMessage || response?.message || 'Backtest failed')
                }
            } catch (error) {
                // No existing backtest found or error fetching - this is okay, user can run a new one
                console.log('No existing backtest found or error:', error)
            }
        }

        fetchExistingBacktest()
    }, [strategyData?._id])

    useEffect(() => {
        if (!backtestData || backtestStatus !== 'completed') {
            return
        }

        const breakdownKey = activeSymbol === 'all' ? 'ALL' : activeSymbol
        try {
            const transformedResults = transformBacktestData(backtestData, breakdownKey)
            const breakdown = getBreakdownByKey(backtestData, breakdownKey)
            if (!breakdown?.equityCurve?.length) {
                throw new Error('Backtest breakdown is missing')
            }
            const formattedEquityCurve = formatEquityCurve(breakdown.equityCurve)
            setBacktestResults(transformedResults)
            setEquityCurve(formattedEquityCurve)
            setHasResults(true)
        } catch (error) {
            setHasResults(false)
            setBacktestResults(null)
            setEquityCurve([])
            setErrorMessage(extractBacktestErrorMessage(error))
        }
    }, [activeSymbol, backtestData, backtestStatus])

    return (
        <div className="space-y-6">
            <BacktestConfigurationSection
                dateRange={dateRange}
                backtestStatus={backtestStatus}
                isRunDisabled={isRunDisabled}
                strategyData={strategyData}
                activeIndicators={activeIndicators}
                stopLossText={stopLossText}
                takeProfitText={takeProfitText}
                hasResults={hasResults}
                showSymbolTabs={true}
                activeSymbol={activeSymbol}
                onActiveSymbolChange={setActiveSymbol}
                onDateRangeChange={setDateRange}
                onRunBacktest={handleRunBacktest}
                onReset={handleReset}
            />

            {backtestStatus === 'running' && <BacktestLoadingState />}

            {backtestStatus === 'failed' && errorMessage && (
                <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
                    <p className="font-semibold text-lg mb-2">Backtest Failed</p>
                    <p className="text-sm text-neutral-100">{errorMessage}</p>
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
