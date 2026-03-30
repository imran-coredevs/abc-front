export type BacktestStatus = 'idle' | 'running' | 'completed' | 'failed'

export type StrategyInfo = {
    _id?: string
    symbol?: string
    timeframe?: string
    indicators?: Record<string, { role: string } | undefined>
    risk?: {
        stopLoss?: { type: string; fixedPercentage?: number; structuralLookback?: number }
        takeProfit?: { type: string; fixedPercentage?: number; riskRewardRatio?: number }
    }
    symbols?: string[] | string
}

export type BacktestResult = {
    netProfit: number
    netProfitPct: number
    winRate: number
    sharpeRatio: number
    totalTrades: number
    averageWin: number
    averageLoss: number
    expectancy: number
    maxDrawdown: number
    timeInMarket: number
    avgTradeDuration: string
    longTrades: number
    shortTrades: number
    exposureRatio: number
    winningTrades: number
    losingTrades: number
    profitFactor: number
    maxConsecutiveWins: number
    maxConsecutiveLosses: number
}

export type EquityCurvePoint = {
    month: string
    equity: number
}
