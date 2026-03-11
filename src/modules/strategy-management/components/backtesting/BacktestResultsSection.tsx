import Separator from '@/components/ui/Separator'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { EQUITY_CHART_CONFIG, INDICATOR_LABELS } from './constants'
import type { BacktestResult, EquityCurvePoint } from './types'

type BacktestResultsSectionProps = {
    activeIndicators: string[]
    results: BacktestResult
    equityCurve: EquityCurvePoint[]
}

export default function BacktestResultsSection({
    activeIndicators,
    results,
    equityCurve,
}: BacktestResultsSectionProps) {
    // Calculate dynamic chart domain
    const equityValues = equityCurve.map((point) => point.equity)
    const minEquity = Math.min(...equityValues)
    const maxEquity = Math.max(...equityValues)
    const padding = (maxEquity - minEquity) * 0.1 // 10% padding
    const chartMin = Math.max(0, minEquity - padding)
    const chartMax = maxEquity + padding

    // Format Y-axis values dynamically
    const formatYAxis = (value: number) => {
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}k`
        }
        return `$${value.toFixed(0)}`
    }

    return (
        <div className="relative space-y-6 overflow-hidden rounded-xl bg-white/5 p-5">
            <div className="pointer-events-none absolute -bottom-[25%] left-1/2 -z-1 h-200 w-200 -translate-x-1/2 rounded-full bg-linear-to-b from-blue-700 to-blue-900 blur-[500px]" />

            <div>
                <h3 className="text-xl font-bold text-neutral-50">Backtest Results</h3>
                <p className="mt-2 text-base text-neutral-200">
                    These metrics summarize how the strategy performed during the selected period
                </p>
            </div>

            <Separator />

            <div className="space-y-3 rounded-lg bg-white/5 p-6">
                <h4 className="text-xl font-semibold text-neutral-50">Performance Overview</h4>
                <Separator />

                <div className="space-y-2 text-lg leading-6">
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-300">Net Profit:</span>
                        <span className={cn('font-bold', results.netProfit >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {results.netProfit >= 0 ? '+' : ''}${results.netProfit.toFixed(2)}
                        </span>
                        <span className={cn('text-sm', results.netProfitPct >= 0 ? 'text-green-400' : 'text-red-400')}>
                            ({results.netProfitPct >= 0 ? '+' : ''}{results.netProfitPct.toFixed(2)}%)
                        </span>
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
                        <span className="font-medium text-neutral-300">Win Rate:</span>
                        <span className="font-bold text-neutral-50">{results.winRate.toFixed(1)}%</span>
                        <span className="text-sm text-neutral-400">
                            ({results.winningTrades}W / {results.losingTrades}L)
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-300">Sharpe Ratio:</span>
                        <span className="font-bold text-neutral-50">{results.sharpeRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-300">Profit Factor:</span>
                        <span
                            className={cn(
                                'font-bold',
                                results.profitFactor >= 1 ? 'text-green-500' : 'text-red-500',
                            )}
                        >
                            {results.profitFactor.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-300">Total Trades:</span>
                        <span className="font-bold text-neutral-50">{results.totalTrades}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-300">Average Win:</span>
                        <span className="font-bold text-green-500">+${results.averageWin.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-300">Average Loss:</span>
                        <span className="font-bold text-red-500">-${Math.abs(results.averageLoss).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-300">Expectancy:</span>
                        <span className={cn('font-bold', results.expectancy >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {results.expectancy >= 0 ? '+' : ''}${results.expectancy.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-300">Maximum Drawdown:</span>
                        <span className="font-bold text-red-500">{results.maxDrawdown.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-300">Max Consecutive:</span>
                        <span className="text-sm">
                            <span className="text-green-500 font-bold">{results.maxConsecutiveWins}W</span>
                            {' / '}
                            <span className="text-red-500 font-bold">{results.maxConsecutiveLosses}L</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
                <div className="space-y-4 rounded-xl bg-neutral-950 p-5">
                    <div>
                        <h4 className="text-xl font-semibold text-neutral-200">Equity Curve</h4>
                        <p className="mt-2 text-sm text-neutral-200">
                            Shows how the simulated account balance changed during the selected period
                        </p>
                    </div>

                    <Separator />

                    <ChartContainer config={EQUITY_CHART_CONFIG} className="h-64 w-full">
                        <AreaChart data={equityCurve} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6545ee" stopOpacity={0.45} />
                                    <stop offset="95%" stopColor="#6545ee" stopOpacity={0.04} />
                                </linearGradient>
                            </defs>
                            {/* <CartesianGrid vertical={false} stroke="#1f2634" strokeDasharray="0" /> */}
                            <XAxis
                                dataKey="month"
                                tick={{ fill: '#f6f7f9', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fill: '#f6f7f9', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={formatYAxis}
                                width={50}
                                domain={[chartMin, chartMax]}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent />}
                                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Equity']}
                            />
                            <Area
                                type="monotone"
                                dataKey="equity"
                                stroke="#6545ee"
                                strokeWidth={3}
                                fill="url(#equityGradient)"
                                dot={false}
                                activeDot={{ r: 4, fill: '#6545ee' }}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>

                <div className="space-y-3 rounded-lg bg-white/5 p-6">
                    <h4 className="text-xl font-semibold text-neutral-50">Risk & Exposure Statistics</h4>
                    <Separator />

                    <div className="space-y-2 text-lg leading-6">
                        {[
                            { label: 'Time in Market:', value: `${results.timeInMarket.toFixed(1)}%` },
                            { label: 'Avg Trade Duration:', value: results.avgTradeDuration },
                            { label: 'Long Trades:', value: results.longTrades },
                            { label: 'Short Trades:', value: results.shortTrades },
                            { label: 'Exposure Ratio:', value: `${results.exposureRatio.toFixed(1)}%` },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center gap-3">
                                <span className="font-medium text-neutral-300">{label}</span>
                                <span className="font-bold text-neutral-50">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
