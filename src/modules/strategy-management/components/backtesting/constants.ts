import type { ChartConfig } from '@/components/ui/chart'
import type { BacktestResult, EquityCurvePoint } from './types'

export const INDICATOR_LABELS: Record<string, string> = {
    utBot: 'UT Bot',
    superTrend: 'SuperTrend',
    hullSuite: 'Hull Suite',
    squeezeMomentum: 'Squeeze',
    rsi: 'RSI',
    adx: 'ADX',
}

export const MOCK_EQUITY_CURVE: EquityCurvePoint[] = [
    { month: 'Jan', equity: 30000 },
    { month: 'Feb', equity: 10850 },
    { month: 'Mar', equity: 50200 },
    { month: 'Apr', equity: 90400 },
    { month: 'May', equity: 60900 },
    { month: 'Jun', equity: 92200 },
    { month: 'Jul', equity: 1800 },
    { month: 'Aug', equity: 103100 },
    { month: 'Sep', equity: 72700 },
    { month: 'Oct', equity: 64200 },
    { month: 'Nov', equity: 93800 },
    { month: 'Dec', equity: 15400 },
]

export const MOCK_RESULTS: BacktestResult = {
    netProfit: 5400,
    netProfitPct: 54.0,
    winRate: 62.5,
    sharpeRatio: 1.84,
    totalTrades: 48,
    averageWin: 312.5,
    averageLoss: -187.3,
    expectancy: 124.7,
    maxDrawdown: -18.4,
    timeInMarket: 72.3,
    avgTradeDuration: '4h 32m',
    longTrades: 28,
    shortTrades: 20,
    exposureRatio: 68.5,
}

export const EQUITY_CHART_CONFIG: ChartConfig = {
    equity: { label: 'Equity', color: '#22c55e' },
}
