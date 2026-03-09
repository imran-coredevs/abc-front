import type { StrategyFormData } from '../types/strategy-form.types'

export const STRATEGY_FORM_DEFAULTS: StrategyFormData = {
    name: '',
    symbol: 'BTCUSDT',
    timeframe: '15m',
    tradeDirection: 'BOTH',
    candleType: 'STANDARD',
    marginType: 'CROSSED',
    capitalAllocationType: 'FIXED_AMOUNT',
    allocationValue: 1000,
    leverage: 5,
    maxOpenPositions: 1,
    maxTradeDuration: 0,
    positionSizingMethod: 'PERCENTAGE',
    fixedTradeAmount: 100,
    capitalPercentagePerTrade: 100,
    minSignalAgreement: 1,
    indicators: {
        rsi: { role: 'signal', period: 14, overboughtLevel: 70, oversoldLevel: 30, source: 'close', smoothingType: 'None', smoothingLength: 14, bbMultiplier: 2, signalLookbackBars: 1 },
        utBot: { role: 'signal', atrPeriod: 10, atrMultiplier: 1, signalLookbackBars: 1, useHeikinAshi: false },
        superTrend: { role: 'disabled', atrPeriod: 10, atrMultiplier: 3, srcPrice: 'hl2', signalLookbackBars: 1 },
        hullSuite: { role: 'disabled', length: 55, lengthMultiplier: 2, mode: 'Hma', signalLookbackBars: 1 },
        adx: { role: 'disabled', diLength: 14, adxLength: 14, threshold: 25, conditionType: 'Above' },
        squeezeMomentum: { role: 'disabled', bollingerBandsPeriod: 20, bollingerBandsMultiplier: 2, keltnerChannelPeriod: 20, keltnerChannelMultiplier: 1.5, useTrueRange: true, signalLookbackBars: 1 },
    },
    risk: {
        stopLoss: { type: 'FIXED_PERCENTAGE', fixedPercentage: 2, structuralLookback: 10 },
        breakEven: { enabled: false, triggerPercentage: 1, offsetPercentage: 0.1 },
        trailingStop: { enabled: false, trailingPercentage: 1 },
        takeProfit: { type: 'FIXED_PERCENTAGE', fixedPercentage: 4, riskRewardRatio: 2, partialLevels: [{ triggerPercentage: 2, closePercentage: 50 }] },
    },
    strategyExits: { onOppositeSignal: true, onTrendChange: false, allowReEntryOnActiveSignal: false, reEntryCooldownBars: 1 },
}

// Full DTO timeframe list. UI enforces min 5m — 1m/3m are excluded from the dropdown.
export const TIMEFRAMES = ['5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M']
export const TRADE_DIRECTIONS = ['BUY', 'SELL', 'BOTH']
export const CAPITAL_ALLOCATION_TYPES = ['PERCENTAGE_OF_PORTFOLIO', 'FIXED_AMOUNT']
export const POSITION_SIZING_METHODS = ['FIXED', 'PERCENTAGE']
export const CANDLE_TYPES = ['STANDARD', 'HEIKIN_ASHI']
export const MARGIN_TYPES = ['CROSSED', 'ISOLATED']
export const PRICE_SOURCES = ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4']
export const SUPERTREND_SRC = ['close', 'hl2', 'hlc3', 'ohlc4']
export const RSI_SMOOTHING = ['None', 'SMA', 'SMA + Bollinger Bands', 'EMA', 'RMA', 'WMA']
export const ADX_CONDITIONS = ['Above', 'Below', 'Rising', 'Falling', 'CrossingAbove', 'CrossingBelow']
export const HULL_MODES = ['Hma', 'Thma', 'Ehma']
export const STOP_LOSS_TYPES = ['FIXED_PERCENTAGE', 'STRUCTURAL']
export const TAKE_PROFIT_TYPES = ['FIXED_PERCENTAGE', 'RISK_REWARD', 'MULTI_LEVEL']
export const INDICATOR_ROLES = ['signal', 'filterOnly']
export const ADX_ROLES = ['filterOnly']
