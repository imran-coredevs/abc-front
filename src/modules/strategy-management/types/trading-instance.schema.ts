// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

// ── Instance ──────────────────────────────────────────────────────────────────

export const INSTANCE_STATUSES        = ['DRAFT', 'STARTING', 'LIVE', 'STOPPING', 'STOPPED', 'BACKTESTING'] as const;
export const CAPITAL_ALLOCATION_TYPES = ['PERCENTAGE_OF_PORTFOLIO', 'FIXED_AMOUNT'] as const;
export const POSITION_SIZING_METHODS  = ['FIXED', 'PERCENTAGE'] as const;
export const TRADE_DIRECTIONS         = ['LONG', 'SHORT', 'BOTH'] as const;
export const CANDLE_TYPES             = ['STANDARD', 'HEIKIN_ASHI'] as const;
export const MARGIN_TYPES             = ['CROSSED', 'ISOLATED'] as const;

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
export type MarginType            = typeof MARGIN_TYPES[number];

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
  signalLookbackBars?: number;
}

export interface HullSuiteConfig {
  role: IndicatorRole;
  length: number;
  lengthMultiplier: number;
  mode: HullMode;
  signalLookbackBars?: number;
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
  signalLookbackBars?: number;
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

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────

@Schema({ timestamps: true })
export class TradingInstance extends Document {

  @Prop({ required: true, type: Types.ObjectId, ref: 'Investor' })
  investorId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: INSTANCE_STATUSES, default: 'DRAFT' })
  status: InstanceStatus;

  @Prop({ required: true })
  timeframe: string;

  /** Single trading pair per instance (e.g. BTCUSDT). */
  @Prop({ required: true })
  symbol: string;

  // ── Capital Allocation ────────────────────────────────────────────────────

  /**
   *  PERCENTAGE_OF_PORTFOLIO — allocationValue is X% of total portfolio equity (1–100)
   *  FIXED_AMOUNT            — allocationValue is a fixed USDT capital pool (> 0)
   */
  @Prop({ type: String, enum: CAPITAL_ALLOCATION_TYPES, required: true })
  capitalAllocationType: CapitalAllocationType;

  @Prop({ required: true, min: 0.01 })
  allocationValue: number;

  // ── Leverage & Positions ──────────────────────────────────────────────────

  @Prop({ required: true, min: 1, max: 125 })
  leverage: number;

  @Prop({ required: true, min: 1, default: 1 })
  maxOpenPositions: number;

  @Prop({ type: String, enum: TRADE_DIRECTIONS, default: 'BOTH' })
  tradeDirection: TradeDirection;

  /** Maximum allowed trade duration in seconds. 0 = no limit. */
  @Prop({ min: 0, default: 0 })
  maxTradeDuration: number;

  // ── Position Sizing ───────────────────────────────────────────────────────

  /**
   * FIXED      — each trade uses fixedTradeAmount USDT.
   * PERCENTAGE — each trade uses capitalPercentagePerTrade % of the instance capital pool.
   */
  @Prop({ type: String, enum: POSITION_SIZING_METHODS, required: true })
  positionSizingMethod: PositionSizingMethod;

  /** Required when positionSizingMethod is FIXED. */
  @Prop({ min: 0.01 })
  fixedTradeAmount?: number;

  /** Required when positionSizingMethod is PERCENTAGE. Range: 1–100. */
  @Prop({ min: 0.01, max: 100 })
  capitalPercentagePerTrade?: number;

  // ── Candle & Margin Settings ──────────────────────────────────────────────

  @Prop({ type: String, enum: CANDLE_TYPES, default: 'STANDARD' })
  candleType: CandleType;

  @Prop({ type: String, enum: MARGIN_TYPES, default: 'CROSSED' })
  marginType: MarginType;

  /**
   * Minimum number of signal-role indicators that must agree on direction
   * before an entry is taken. Defaults to 1 (any single signal indicator is
   * sufficient). Increase only when using multiple signal indicators and you
   * want all of them to agree before entering.
   */
  @Prop({ min: 1, max: 100, default: 1 })
  minSignalAgreement?: number;

  // ── Indicators ────────────────────────────────────────────────────────────

  @Prop({ type: Object, default: () => ({}) })
  indicators: IndicatorsConfig;

  // ── Risk Management ───────────────────────────────────────────────────────

  @Prop({ type: Object, default: () => ({}) })
  risk: RiskConfig;

  // ── Strategy Exits ────────────────────────────────────────────────────────

  @Prop({ type: Object, default: () => ({}) })
  strategyExits?: StrategyExitsConfig;

  // ── Live Performance Snapshot ─────────────────────────────────────────────

  /**
   * Rolling counters updated after each closed trade.
   * Live-mode only — backtest results are stored in BacktestResult documents.
   */
  @Prop({
    type: Object,
    default: (): PerformanceSnapshot => ({
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      currentDrawdown: 0,
      netProfit: 0,
      peakNetProfit: 0,
      winRate: 0,
      maxDrawdown: 0,
      sharpeRatio: undefined,
      averageWin: 0,
      averageLoss: 0,
      expectancy: 0,
      timeInMarket: 0,
      exposureTime: 0,
      lastUpdated: new Date(),
    }),
  })
  performance: PerformanceSnapshot;

  // ── Relations ─────────────────────────────────────────────────────────────

  @Prop({ type: [Types.ObjectId], ref: 'Position', default: [] })
  activePositions: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const TradingInstanceSchema = SchemaFactory.createForClass(TradingInstance);

export type TradingInstanceDocument = TradingInstance & Document;

// ── Pre-save validation ───────────────────────────────────────────────────────

TradingInstanceSchema.pre('save', function (next) {

  // Capital allocation
  if (this.capitalAllocationType === 'PERCENTAGE_OF_PORTFOLIO') {
    if (this.allocationValue <= 0 || this.allocationValue > 100) {
      return next(new Error('allocationValue must be between 1–100 for PERCENTAGE_OF_PORTFOLIO'));
    }
  } else {
    if (this.allocationValue <= 0) {
      return next(new Error('allocationValue must be > 0 for FIXED_AMOUNT'));
    }
  }

  // Position sizing
  if (this.positionSizingMethod === 'FIXED') {
    if (!this.fixedTradeAmount || this.fixedTradeAmount <= 0) {
      return next(new Error('fixedTradeAmount is required and must be > 0 when positionSizingMethod is FIXED'));
    }
  } else if (this.positionSizingMethod === 'PERCENTAGE') {
    if (!this.capitalPercentagePerTrade || this.capitalPercentagePerTrade <= 0 || this.capitalPercentagePerTrade > 100) {
      return next(new Error('capitalPercentagePerTrade must be between 1–100 when positionSizingMethod is PERCENTAGE'));
    }
  }

  // Stop loss
  if (this.risk?.stopLoss) {
    const sl = this.risk.stopLoss;
    if (sl.type === 'FIXED_PERCENTAGE' && (!sl.fixedPercentage || sl.fixedPercentage <= 0)) {
      return next(new Error('stopLoss.fixedPercentage is required and must be > 0 for FIXED_PERCENTAGE'));
    }
    if (sl.type === 'STRUCTURAL' && (!sl.structuralLookback || sl.structuralLookback < 1)) {
      return next(new Error('stopLoss.structuralLookback is required and must be >= 1 for STRUCTURAL'));
    }
  }

  // Break-even
  if (this.risk?.breakEven?.enabled) {
    if (!this.risk.breakEven.triggerPercentage || this.risk.breakEven.triggerPercentage <= 0) {
      return next(new Error('breakEven.triggerPercentage is required and must be > 0 when breakEven is enabled'));
    }
  }

  // Trailing stop
  if (this.risk?.trailingStop?.enabled) {
    if (!this.risk.trailingStop.trailingPercentage || this.risk.trailingStop.trailingPercentage <= 0) {
      return next(new Error('trailingStop.trailingPercentage is required and must be > 0 when trailingStop is enabled'));
    }
  }

  // Take profit
  if (this.risk?.takeProfit) {
    const tp = this.risk.takeProfit;

    if (tp.type === 'FIXED_PERCENTAGE' && (!tp.fixedPercentage || tp.fixedPercentage <= 0)) {
      return next(new Error('takeProfit.fixedPercentage is required and must be > 0 for FIXED_PERCENTAGE'));
    }

    if (tp.type === 'RISK_REWARD' && (!tp.riskRewardRatio || tp.riskRewardRatio <= 0)) {
      return next(new Error('takeProfit.riskRewardRatio is required and must be > 0 for RISK_REWARD'));
    }

    if (tp.type === 'MULTI_LEVEL') {
      if (!tp.partialLevels || tp.partialLevels.length === 0) {
        return next(new Error('takeProfit.partialLevels must have at least one level for MULTI_LEVEL'));
      }

      const totalClose = tp.partialLevels.reduce((sum, l) => sum + l.closePercentage, 0);
      if (totalClose > 100) {
        return next(new Error('takeProfit.partialLevels closePercentage values must not exceed 100% in total'));
      }

      for (let i = 0; i < tp.partialLevels.length; i++) {
        const level = tp.partialLevels[i];

        if (!level.triggerPercentage || level.triggerPercentage <= 0) {
          return next(new Error(`takeProfit.partialLevels[${i}].triggerPercentage must be > 0`));
        }
        if (!level.closePercentage || level.closePercentage <= 0 || level.closePercentage > 100) {
          return next(new Error(`takeProfit.partialLevels[${i}].closePercentage must be between 1–100`));
        }
        if (i > 0 && level.triggerPercentage <= tp.partialLevels[i - 1].triggerPercentage) {
          return next(new Error(
            `takeProfit.partialLevels must have strictly ascending triggerPercentage values (index ${i} violates this)`,
          ));
        }
      }
    }
  }

  next();
});

// ── Indexes ───────────────────────────────────────────────────────────────────

TradingInstanceSchema.index({ investorId: 1, status: 1 });
TradingInstanceSchema.index({ investorId: 1, createdAt: -1 });
TradingInstanceSchema.index({ status: 1 });
TradingInstanceSchema.index({ symbol: 1, status: 1 });