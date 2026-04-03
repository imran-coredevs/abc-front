import { api } from '@/config/apiConfig'

// ─────────────────────────────────────────────────────────────────────────────
// Response Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardResponse {
    data: {
        portfolio: {
            totalCapital: number
            portfolioPercentage: number
        }
        todaysPerformance: {
            pnl: number
            percentageChange: number
            yesterdayPnL: number
        }
        totalStrategies: number
        activeStrategies: number
    }
    status: string
    meta: {
        timestamp: string
        requestId: string
    }
}

export interface InstanceOverview {
    id: string
    strategyName: string
    tradingPair?: string
    symbols?: string[]
    timeframe: string
    direction: 'LONG' | 'SHORT' | 'BOTH'
    openPositions: number
    allocatedCapital?: number
    allocationValue?: number
    allocationType?: 'PERCENTAGE_OF_PORTFOLIO' | 'FIXED_AMOUNT'
    allocation?: string
    leverage: number
    todayPnL: number
    lastTrade: string | null
    status: 'DRAFT' | 'STARTING' | 'LIVE' | 'STOPPING' | 'STOPPED'
}

export interface OverviewResponse {
    data: InstanceOverview[]
    status: string
    meta: {
        timestamp: string
        requestId: string
    }
}

export interface PaginatedInstancesResponse {
    data: {
        instances: any[]
        total: number
        page: number
        limit: number
        totalPages: number
    }
    status: string
    meta: {
        timestamp: string
        requestId: string
    }
}

export interface RiskMetricsResponse {
    data: {
        instanceId: string
        instanceName: string
        capitalAllocationType: string
        allocationValue: number
        resolvedCapital: number
        leverage: number
        maxOpenPositions: number
        risk: {
            totalRiskAmount: number
            riskPercentage: number
            totalExposure: number
            exposurePercentage: number
            totalUnrealizedPnL: number
            openPositions: number
            utilizationPercentage: number
        }
        riskConfig: any
    }
    status: string
    meta: {
        timestamp: string
        requestId: string
    }
}

export interface TradeHistoryItem {
    tradeId: string
    strategyName: string
    tradingPair: string
    direction: 'LONG' | 'SHORT'
    entryPrice: number
    exitPrice: number
    leverage: number
    size: number
    pnl: number
    pnlPercentage: number
    duration: string
    exitReason: string
    closed: string
    entryTime: string
    exitTime: string
}

export interface TradeHistoryResponse {
    data: TradeHistoryItem[]
    status: string
    meta: {
        timestamp: string
        requestId: string
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
    }
}

export interface TradeHistoryFilters {
    page?: number
    limit?: number
    result?: 'all' | 'profit' | 'loss'
    direction?: 'all' | 'long' | 'short'
    dateFrom?: string
    dateTo?: string
}

export interface InstanceDetailResponse {
    data: {
        maxPortfolioExposurePercentage: number
        _id: string
        name: string
        symbols: string[]
        timeframe: string
        tradeDirection: 'LONG' | 'SHORT' | 'BOTH'
        capitalAllocationType: 'PERCENTAGE_OF_PORTFOLIO' | 'FIXED_AMOUNT'
        allocationValue: number
        leverage: number
        maxOpenPositions: number
        positionSizingMethod: 'FIXED' | 'PERCENTAGE'
        fixedTradeAmount?: number
        capitalPercentagePerTrade?: number
        candleType: 'STANDARD' | 'HEIKIN_ASHI'
        minSignalAgreement: number
        status: 'DRAFT' | 'STARTING' | 'LIVE' | 'STOPPING' | 'STOPPED'
        indicators?: any
        risk?: any
        strategyExits?: any
        investorId: string
        createdAt: string
        updatedAt: string
    }
    status: string
    meta: {
        timestamp: string
        requestId: string
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Instance Service
// ─────────────────────────────────────────────────────────────────────────────

export const instanceService = {
    /**
     * Get dashboard metrics (portfolio, today's performance, strategy counts)
     */
    getDashboard: () =>
        api.get<DashboardResponse>('/instances/dashboard').then((r) => r.data),

    /**
     * Get overview table data for all instances
     */
    getOverview: () =>
        api.get<OverviewResponse>('/instances/overview').then((r) => r.data),

    /**
     * Get paginated list of instances
     */
    getInstances: (page = 1, limit = 10) =>
        api.get<PaginatedInstancesResponse>('/instances', {
            params: { page, limit },
        }).then((r) => r.data),

    /**
     * Get a single instance by ID
     */
    getInstance: (id: string) =>
        api.get<InstanceDetailResponse>(`/instances/${id}`).then((r) => r.data),

    /**
     * Create a new trading instance
     */
    createInstance: (data: any) =>
        api.post<InstanceDetailResponse>('/instances', data).then((r) => r.data),

    /**
     * Update an existing instance
     */
    updateInstance: (id: string, data: any) =>
        api.patch<InstanceDetailResponse>(`/instances/${id}`, data).then((r) => r.data),

    /**
     * Delete an instance (soft delete)
     */
    deleteInstance: (id: string) =>
        api.delete(`/instances/${id}`).then((r) => r.data),

    /**
     * Start a trading instance
     */
    startInstance: (id: string) =>
        api.post(`/instances/${id}/start`).then((r) => r.data),

    /**
     * Stop a trading instance
     */
    stopInstance: (id: string, reason?: string) =>
        api.post(`/instances/${id}/stop`, { reason }).then((r) => r.data),

    /**
     * Get risk metrics for an instance
     */
    getRiskMetrics: (id: string) =>
        api.get<RiskMetricsResponse>(`/instances/${id}/risk`).then((r) => r.data),

    /**
     * Get trade history with filters
     */
    getTradeHistory: (filters?: TradeHistoryFilters) =>
        api.get<TradeHistoryResponse>('/instances/history', {
            params: filters,
        }).then((r) => r.data),
}
