import type { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import type {
    AdxCondition,
    AdxRole,
    CandleType,
    CapitalAllocationType,
    HullMode,
    IndicatorRole,
    PositionSizingMethod,
    PriceSource,
    RsiSmoothing,
    StopLossType,
    SuperTrendSrc,
    TakeProfitType,
    TradeDirection,
} from './trading-instance.schema'

export type PartialTpLevel = { triggerPercentage: number; closePercentage: number }

export type StrategyFormData = {
    name: string
    symbols: string[]
    timeframe: string
    tradeDirection: TradeDirection
    candleType: CandleType
    capitalAllocationType: CapitalAllocationType
    allocationValue: number
    leverage: number
    maxOpenPositions: number
    maxPortfolioExposurePercentage: number
    maxTradeDuration: number
    positionSizingMethod: PositionSizingMethod
    fixedTradeAmount: number
    capitalPercentagePerTrade: number
    minSignalAgreement: number
    indicators: {
        rsi: {
            role: IndicatorRole
            period: number
            overboughtLevel: number
            oversoldLevel: number
            source: PriceSource
            smoothingType: RsiSmoothing
            smoothingLength: number
            bbMultiplier: number
        }
        utBot: {
            role: IndicatorRole
            atrPeriod: number
            atrMultiplier: number
            signalLookbackBars: number
            useHeikinAshi: boolean
        }
        superTrend: {
            role: IndicatorRole
            atrPeriod: number
            atrMultiplier: number
            srcPrice: SuperTrendSrc
        }
        hullSuite: {
            role: IndicatorRole
            length: number
            lengthMultiplier: number
            mode: HullMode
        }
        adx: { role: AdxRole; diLength: number; adxLength: number; threshold: number; conditionType: AdxCondition }
        squeezeMomentum: {
            role: IndicatorRole
            bollingerBandsPeriod: number
            bollingerBandsMultiplier: number
            keltnerChannelPeriod: number
            keltnerChannelMultiplier: number
            useTrueRange: boolean
            signalLookbackBars: number
        }
    }
    risk: {
        stopLoss: {
            type: StopLossType
            fixedPercentage: number
            structuralLookback: number
            structuralBufferPercent?: number
            structuralMaxDistancePercent?: number
        }
        breakEven: { enabled: boolean; triggerPercentage: number; offsetPercentage: number }
        trailingStop: { enabled: boolean; trailingPercentage: number }
        takeProfit: {
            type: TakeProfitType
            fixedPercentage: number
            riskRewardRatio: number
            partialLevels: PartialTpLevel[]
        }
    }
    strategyExits: {
        onOppositeSignal: boolean
        onTrendChange: boolean
        allowReEntryOnActiveSignal: boolean
        reEntryCooldownBars: number
    }
}

export type StrategyControl = Control<StrategyFormData>
export type StrategyWatch = UseFormWatch<StrategyFormData>
export type StrategySetValue = UseFormSetValue<StrategyFormData>
