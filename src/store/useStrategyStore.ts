import { STRATEGY_FORM_DEFAULTS } from '@/modules/strategy-management/constants/strategy-form.defaults'
import type { StrategyFormData } from '@/modules/strategy-management/types/strategy-form.types'
import { create } from 'zustand'

export type StrategyStatus = 'LIVE' | 'STOPPED' | 'DRAFT'

export type StoredStrategy = {
    id: string
    apiKey: string
    status: StrategyStatus
    formData: StrategyFormData
}

function mkStrategy(
    id: string,
    apiKey: string,
    status: StrategyStatus,
    overrides: Partial<StrategyFormData> & { name: string },
): StoredStrategy {
    return { id, apiKey, status, formData: { ...STRATEGY_FORM_DEFAULTS, ...overrides } }
}

// Full test strategy — every indicator active, all risk features enabled, every field populated
const FULL_TEST_STRATEGY: StoredStrategy = {
    id: '1',
    apiKey: 'binance-api-1157f8e9a4b3c2d1e0f9a8b7c6d5e4f3',
    status: 'LIVE',
    formData: {
        name: 'Momentum Breakout',
        symbol: 'BTCUSDT',
        timeframe: '15m',
        tradeDirection: 'BOTH',
        candleType: 'STANDARD',
        marginType: 'CROSSED',
        capitalAllocationType: 'FIXED_AMOUNT',
        allocationValue: 5000,
        leverage: 10,
        maxOpenPositions: 2,
        maxTradeDuration: 3600,
        positionSizingMethod: 'PERCENTAGE',
        fixedTradeAmount: 500,
        capitalPercentagePerTrade: 20,
        minSignalAgreement: 2,
        indicators: {
            rsi: {
                role: 'signal',
                period: 14,
                overboughtLevel: 70,
                oversoldLevel: 30,
                source: 'close',
                smoothingType: 'EMA',
                smoothingLength: 9,
                bbMultiplier: 2,
                signalLookbackBars: 2,
            },
            utBot: {
                role: 'signal',
                atrPeriod: 10,
                atrMultiplier: 1.5,
                signalLookbackBars: 2,
                useHeikinAshi: true,
            },
            superTrend: {
                role: 'filterOnly',
                atrPeriod: 12,
                atrMultiplier: 3,
                srcPrice: 'hl2',
                signalLookbackBars: 1,
            },
            hullSuite: {
                role: 'filterOnly',
                length: 55,
                lengthMultiplier: 2,
                mode: 'Hma',
                signalLookbackBars: 1,
            },
            adx: {
                role: 'filterOnly',
                diLength: 14,
                adxLength: 14,
                threshold: 25,
                conditionType: 'Above',
            },
            squeezeMomentum: {
                role: 'signal',
                bollingerBandsPeriod: 20,
                bollingerBandsMultiplier: 2,
                keltnerChannelPeriod: 20,
                keltnerChannelMultiplier: 1.5,
                useTrueRange: true,
                signalLookbackBars: 2,
            },
        },
        risk: {
            stopLoss: { type: 'STRUCTURAL', fixedPercentage: 2, structuralLookback: 5 },
            breakEven: { enabled: true, triggerPercentage: 1.5, offsetPercentage: 0.2 },
            trailingStop: { enabled: true, trailingPercentage: 1.5 },
            takeProfit: {
                type: 'MULTI_LEVEL',
                fixedPercentage: 4,
                riskRewardRatio: 2,
                partialLevels: [
                    { triggerPercentage: 2, closePercentage: 40 },
                    { triggerPercentage: 5, closePercentage: 60 },
                ],
            },
        },
        strategyExits: {
            onOppositeSignal: true,
            onTrendChange: true,
            allowReEntryOnActiveSignal: true,
            reEntryCooldownBars: 3,
        },
    },
}

const INITIAL_STRATEGIES: StoredStrategy[] = [
    FULL_TEST_STRATEGY,
    mkStrategy('2', 'binance-api-2268a9f0b5c4d3e2f1a0b9c8d7e6f5a4', 'LIVE', {
        name: 'Mean Reversion',
        symbol: 'ETHUSDT',
        tradeDirection: 'BOTH',
        allocationValue: 3500,
    }),
    mkStrategy('3', 'binance-api-3379b0a1c6d5e4f3a2b1c0d9e8f7a6b5', 'STOPPED', {
        name: 'Grid Trading',
        symbol: 'BNBUSDT',
        tradeDirection: 'BOTH',
        allocationValue: 2000,
    }),
    mkStrategy('4', 'binance-api-4480c1b2d7e6f5a4b3c2d1e0f9a8b7c6', 'LIVE', {
        name: 'Scalping Pro',
        symbol: 'SOLUSDT',
        tradeDirection: 'SELL',
        allocationValue: 4000,
    }),
    mkStrategy('5', 'binance-api-5591d2c3e8f7a6b5c4d3e2f1a0b9c8d7', 'STOPPED', {
        name: 'Swing Strategy',
        symbol: 'MATICUSDT',
        tradeDirection: 'BUY',
        allocationValue: 1500,
    }),
    mkStrategy('6', 'binance-api-6602e3d4f9a8b7c6d5e4f3a2b1c0d9e8', 'LIVE', {
        name: 'Arbitrage Hunter',
        symbol: 'ADAUSDT',
        tradeDirection: 'BOTH',
        allocationValue: 2500,
    }),
    mkStrategy('7', 'binance-api-7713f4e5a0b9c8d7e6f5a4b3c2d1e0f9', 'STOPPED', {
        name: 'Trend Follower',
        symbol: 'XRPUSDT',
        tradeDirection: 'BUY',
        allocationValue: 3000,
    }),
    mkStrategy('8', 'binance-api-8824a5f6b1c0d9e8f7a6b5c4d3e2f1a0', 'LIVE', {
        name: 'Volatility Master',
        symbol: 'AVAXUSDT',
        tradeDirection: 'SELL',
        allocationValue: 3200,
    }),
]

type StrategyStore = {
    strategies: StoredStrategy[]
    addStrategy: (formData: StrategyFormData) => string
    updateStrategy: (id: string, formData: StrategyFormData) => void
    toggleStatus: (id: string) => void
    deleteStrategy: (id: string) => void
    getById: (id: string) => StoredStrategy | undefined
}

export const useStrategyStore = create<StrategyStore>((set, get) => ({
    strategies: INITIAL_STRATEGIES,

    addStrategy: (formData) => {
        const id = Date.now().toString()
        const newStrategy: StoredStrategy = {
            id,
            apiKey: `binance-api-${Math.random().toString(36).substring(2, 18)}`,
            status: 'DRAFT',
            formData,
        }
        set((state) => ({ strategies: [...state.strategies, newStrategy] }))
        return id
    },

    updateStrategy: (id, formData) => {
        set((state) => ({
            strategies: state.strategies.map((s) => (s.id === id ? { ...s, formData } : s)),
        }))
    },

    toggleStatus: (id) => {
        set((state) => ({
            strategies: state.strategies.map((s) =>
                s.id === id
                    ? { ...s, status: (s.status === 'LIVE' ? 'STOPPED' : 'LIVE') as StrategyStatus }
                    : s,
            ),
        }))
    },

    deleteStrategy: (id) => {
        set((state) => ({ strategies: state.strategies.filter((s) => s.id !== id) }))
    },

    getById: (id) => get().strategies.find((s) => s.id === id),
}))
