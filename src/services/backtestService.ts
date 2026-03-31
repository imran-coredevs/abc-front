import { api } from '@/config/apiConfig'

// ─────────────────────────────────────────────────────────────────────────────
// Response Types
// ─────────────────────────────────────────────────────────────────────────────

export interface EquityCurvePoint {
    timestamp: number
    equity: number
}

export interface BacktestMetrics {
    netProfit: number
    grossProfit: number
    totalFees: number
    totalTrades: number
    winningTrades: number
    losingTrades: number
    longTrades: number
    shortTrades: number
    winRate: number
    averageWin: number
    averageLoss: number
    profitFactor: number
    expectancy: number
    maxDrawdown: number
    maxConsecutiveWins: number
    maxConsecutiveLosses: number
    sharpeRatio: number
    timeInMarket: number
    averageTradeDurationMinutes: number
    skippedDueToCapital: number
}

export interface BacktestBreakdown extends BacktestMetrics {
    key: string
    equityCurve?: EquityCurvePoint[]
    contributionPct?: number
}

export interface BacktestData {
    _id: string
    investorId: string
    tradingInstanceId: string
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
    __v: number
    completedAt?: string
    breakdown: BacktestBreakdown[]
    initialCapital: number
    finalEquity: number
    errorMessage?: string
    indicators: any[]
}

export interface StartBacktestResponse {
    message: string
    instanceId: string
    symbols: string[]
    status: string
    checkStatusUrl: string
    notificationStreamUrl: string
}

export interface BacktestStatusResponse {
    backtest: BacktestData
    message?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Start a backtest for a specific trading instance
 * @param instanceId - The trading instance ID
 * @param startDate - Start date for backtest (ISO string)
 * @param endDate - End date for backtest (ISO string)
 */
export const startBacktest = async (
    instanceId: string,
    startDate: string,
    endDate: string,
): Promise<StartBacktestResponse> => {
    const response = await api.post<
        { data: StartBacktestResponse }
    >('/backtest', {
        instanceId,
        startDate,
        endDate,
    })
    return response.data.data
}

/**
 * Get the status and results of a backtest
 * @param instanceId - The trading instance ID
 */
export const getBacktestStatus = async (instanceId: string): Promise<BacktestStatusResponse> => {
    const response = await api.get<
        { data: BacktestStatusResponse }
    >(`/backtest/instance/${instanceId}`)
    return response.data.data
}

/**
 * Poll backtest status until completion or failure
 * @param instanceId - The trading instance ID
 * @param onProgress - Callback for status updates
 * @param pollInterval - Interval between polls in milliseconds (default: 2000)
 */
export const pollBacktestStatus = async (
    instanceId: string,
    onProgress?: (status: string) => void,
    pollInterval: number = 2000,
): Promise<BacktestData> => {
    return new Promise((resolve, reject) => {
        const poll = async () => {
            try {
                const response = await getBacktestStatus(instanceId)
                const backtest = response.backtest

                if (onProgress) {
                    onProgress(backtest.status)
                }

                if (backtest.status === 'COMPLETED') {
                    resolve(backtest)
                } else if (backtest.status === 'FAILED') {
                    reject(new Error(backtest.errorMessage || response.message || 'Backtest failed'))
                } else {
                    // Continue polling
                    setTimeout(poll, pollInterval)
                }
            } catch (error) {
                reject(error)
            }
        }

        poll()
    })
}
