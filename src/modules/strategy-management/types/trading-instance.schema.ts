// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

// ── Instance ──────────────────────────────────────────────────────────────────

export const INSTANCE_STATUSES        = ['DRAFT', 'STARTING', 'LIVE', 'STOPPING', 'STOPPED', 'BACKTESTING'] as const;
export const CAPITAL_ALLOCATION_TYPES = ['PERCENTAGE_OF_PORTFOLIO', 'FIXED_AMOUNT'] as const;
export const POSITION_SIZING_METHODS  = ['FIXED', 'PERCENTAGE'] as const;
export const TRADE_DIRECTIONS         = ['LONG', 'SHORT', 'BOTH'] as const;
export const CANDLE_TYPES             = ['STANDARD', 'HEIKIN_ASHI'] as const;

// ── Indicators ────────────────────────────────────────────────────────────────

export const INDICATOR_ROLES = ['signal', 'filterOnly', 'disabled'] as const;
export const ADX_ROLES       = ['disabled', 'filterOnly'] as const;  // ADX cannot emit signals
export const PRICE_SOURCES   = ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'] as const;
export const SUPERTREND_SRC  = ['close', 'hl2', 'hlc3', 'ohlc4'] as const;
export const RSI_SMOOTHING   = ['None', 'SMA', 'SMA + Bollinger Bands', 'EMA', 'RMA', 'WMA'] as const;
export const ADX_CONDITIONS  = ['Above', 'Below', 'Rising', 'Falling', 'CrossingAbove', 'CrossingBelow'] as const;
export const HULL_MODES      = ['Hma', 'Thma', 'Ehma'] as const;

// ── Risk ──────────────────────────────────────────────────────────────────────

export const STOP_LOSS_TYPES   = ['FIXED_PERCENTAGE', 'STRUCTURAL'] as const;
export const TAKE_PROFIT_TYPES = ['FIXED_PERCENTAGE', 'RISK_REWARD', 'MULTI_LEVEL'] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Derived types
// ─────────────────────────────────────────────────────────────────────────────

// ── Instance ──────────────────────────────────────────────────────────────────

export type InstanceStatus        = typeof INSTANCE_STATUSES[number];
export type CapitalAllocationType = typeof CAPITAL_ALLOCATION_TYPES[number];
export type PositionSizingMethod  = typeof POSITION_SIZING_METHODS[number];
export type TradeDirection        = typeof TRADE_DIRECTIONS[number];
export type CandleType            = typeof CANDLE_TYPES[number];

// ── Indicators ────────────────────────────────────────────────────────────────

export type IndicatorRole = typeof INDICATOR_ROLES[number];
export type AdxRole       = typeof ADX_ROLES[number];
export type PriceSource   = typeof PRICE_SOURCES[number];
export type SuperTrendSrc = typeof SUPERTREND_SRC[number];
export type RsiSmoothing  = typeof RSI_SMOOTHING[number];
export type AdxCondition  = typeof ADX_CONDITIONS[number];
export type HullMode      = typeof HULL_MODES[number];

// ── Risk ──────────────────────────────────────────────────────────────────────

export type StopLossType   = typeof STOP_LOSS_TYPES[number];
export type TakeProfitType = typeof TAKE_PROFIT_TYPES[number];

// ─────────────────────────────────────────────────────────────────────────────
// Indicator config interfaces — shared between schema and DTOs
// ─────────────────────────────────────────────────────────────────────────────

export interface UtBotConfig {
  role: IndicatorRole;
  atrMultiplier: number;
  atrPeriod: number;
  signalLookbackBars?: number;
  useHeikinAshi?: boolean;
}

export interface SuperTrendConfig {
  role: IndicatorRole;
  atrPeriod: number;
  atrMultiplier: number;
  srcPrice: SuperTrendSrc;
}

export interface HullSuiteConfig {
  role: IndicatorRole;
  length: number;
  lengthMultiplier: number;
  mode: HullMode;
}

export interface RsiConfig {
  role: IndicatorRole;
  period: number;
  overboughtLevel: number;
  oversoldLevel: number;
  source?: PriceSource;
  smoothingType?: RsiSmoothing;
  smoothingLength?: number;
  bbMultiplier?: number;
}

export interface AdxConfig {
  role: AdxRole;  // intentionally narrower — ADX cannot emit signals
  diLength: number;
  adxLength: number;
  threshold: number;
  conditionType?: AdxCondition;
}

export interface SqueezeMomentumConfig {
  role: IndicatorRole;
  bollingerBandsPeriod: number;
  bollingerBandsMultiplier: number;
  keltnerChannelPeriod: number;
  keltnerChannelMultiplier: number;
  useTrueRange?: boolean;
  signalLookbackBars?: number;
}

export interface IndicatorsConfig {
  utBot?: UtBotConfig;
  superTrend?: SuperTrendConfig;
  hullSuite?: HullSuiteConfig;
  rsi?: RsiConfig;
  adx?: AdxConfig;
  squeezeMomentum?: SqueezeMomentumConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// Risk config interfaces — shared between schema and DTOs
// ─────────────────────────────────────────────────────────────────────────────

export interface StopLossConfig {
  type: StopLossType;
  fixedPercentage?: number;    // required when type is FIXED_PERCENTAGE
  structuralLookback?: number; // required when type is STRUCTURAL
  structuralBufferPercent?: number; // optional when type is STRUCTURAL
  structuralMaxDistancePercent?: number; // optional when type is STRUCTURAL
}

export interface BreakEvenConfig {
  enabled: boolean;
  triggerPercentage: number;   // profit % to trigger break-even move
  offsetPercentage?: number;   // offset above entry to lock in (default 0)
}

export interface TrailingStopConfig {
  enabled: boolean;
  trailingPercentage: number;  // trail distance as % from current price
}

export interface PartialTpLevel {
  triggerPercentage: number;   // profit % to trigger this partial close
  closePercentage: number;     // % of position to close (1–100)
}

export interface TakeProfitConfig {
  type: TakeProfitType;
  fixedPercentage?: number;    // required when type is FIXED_PERCENTAGE
  riskRewardRatio?: number;    // required when type is RISK_REWARD
  partialLevels?: PartialTpLevel[]; // required when type is MULTI_LEVEL, must be ascending by triggerPercentage
}

export interface RiskConfig {
  stopLoss?: StopLossConfig;
  breakEven?: BreakEvenConfig;
  trailingStop?: TrailingStopConfig;
  takeProfit?: TakeProfitConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// Strategy exits interface
// ─────────────────────────────────────────────────────────────────────────────

export interface StrategyExitsConfig {
  onOppositeSignal?: boolean;
  onTrendChange?: boolean;
  /** Re-enter on the next bar if the indicator direction still agrees after a risk exit (SL/TP/trailing). */
  allowReEntryOnActiveSignal?: boolean;
  /** Bars to wait after a risk exit before attempting a re-entry (default 1). */
  reEntryCooldownBars?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Performance snapshot interface
// ─────────────────────────────────────────────────────────────────────────────

export interface PerformanceSnapshot {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalProfit: number;
  totalLoss: number;
  currentDrawdown: number;
  netProfit: number;
  peakNetProfit: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio?: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  timeInMarket: number;
  exposureTime: number;
  lastUpdated: Date;
}
