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
    { timestamp: new Date('2024-01-01').getTime(), equity: 30000 },
    { timestamp: new Date('2024-02-01').getTime(), equity: 10850 },
    { timestamp: new Date('2024-03-01').getTime(), equity: 50200 },
    { timestamp: new Date('2024-04-01').getTime(), equity: 90400 },
    { timestamp: new Date('2024-05-01').getTime(), equity: 60900 },
    { timestamp: new Date('2024-06-01').getTime(), equity: 92200 },
    { timestamp: new Date('2024-07-01').getTime(), equity: 1800 },
    { timestamp: new Date('2024-08-01').getTime(), equity: 103100 },
    { timestamp: new Date('2024-09-01').getTime(), equity: 72700 },
    { timestamp: new Date('2024-10-01').getTime(), equity: 64200 },
    { timestamp: new Date('2024-11-01').getTime(), equity: 93800 },
    { timestamp: new Date('2024-12-01').getTime(), equity: 15400 },
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
    winningTrades: 30,
    losingTrades: 18,
    profitFactor: 1.67,
    maxConsecutiveWins: 7,
    maxConsecutiveLosses: 4,
}

export const EQUITY_CHART_CONFIG: ChartConfig = {
    equity: { label: 'Equity', color: '#22c55e' },
}
