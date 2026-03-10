import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/Separator'
import { useStrategyStore } from '@/store/useStrategyStore'
import { Edit, PlayCircle, Trash } from 'iconsax-reactjs'
import { StopCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

type StrategyData = {
    name: string
    status: 'LIVE' | 'STOPPED' | 'DRAFT' | 'STARTING' | 'STOPPING' | 'BACKTESTING'
    symbol: string
    timeframe: string
    tradeDirection: 'BUY' | 'SELL' | 'BOTH'
    capitalAllocationType: 'PERCENTAGE_OF_PORTFOLIO' | 'FIXED_AMOUNT'
    allocationValue: number
    leverage: number
    maxOpenPositions: number
    positionSizingMethod: 'FIXED' | 'PERCENTAGE'
    fixedTradeAmount?: number
    capitalPercentagePerTrade?: number
    candleType: 'STANDARD' | 'HEIKIN_ASHI'
    marginType: 'CROSSED' | 'ISOLATED'
    minSignalAgreement: number
    risk?: {
        stopLoss?: { type: string; fixedPercentage?: number; structuralLookback?: number }
        breakEven?: { enabled: boolean; triggerPercentage?: number; offsetPercentage?: number }
        trailingStop?: { enabled: boolean; trailingPercentage?: number }
        takeProfit?: { type: string; fixedPercentage?: number; riskRewardRatio?: number; partialLevels?: { triggerPercentage: number; closePercentage: number }[] }
    }
    indicators?: {
        rsi?: { role: string; period?: number; overboughtLevel?: number; oversoldLevel?: number; source?: string; smoothingType?: string }
        utBot?: { role: string; atrPeriod?: number; atrMultiplier?: number }
        superTrend?: { role: string; atrPeriod?: number; atrMultiplier?: number; srcPrice?: string }
        hullSuite?: { role: string; length?: number; lengthMultiplier?: number; mode?: string }
        adx?: { role: string; diLength?: number; adxLength?: number; threshold?: number; conditionType?: string }
        squeezeMomentum?: { role: string; bollingerBandsPeriod?: number; bollingerBandsMultiplier?: number; keltnerChannelPeriod?: number; keltnerChannelMultiplier?: number }
    }
    strategyExits?: { onOppositeSignal?: boolean; onTrendChange?: boolean; allowReEntryOnActiveSignal?: boolean; reEntryCooldownBars?: number }
}

type StrategyDetailsTabProps = {
    strategyData: StrategyData
}

const isLiveStatus = (s: string) => s === 'LIVE' || s === 'STARTING'

export default function StrategyDetailsTab({ strategyData }: StrategyDetailsTabProps) {
    const [status, setStatus] = useState(strategyData.status)
    const navigate = useNavigate()
    const { id } = useParams()
    const { toggleStatus, deleteStrategy } = useStrategyStore()

    const handleToggleStatus = () => {
        if (id) toggleStatus(id)
        setStatus((prev) => (isLiveStatus(prev) ? 'STOPPED' : 'LIVE'))
    }

    const handleEdit = () => navigate(`/strategy-management/${id}/edit`)
    const handleDelete = () => {
        if (id) deleteStrategy(id)
        navigate('/strategy-management')
    }

    const directionColor =
        strategyData.tradeDirection === 'BUY'
            ? 'text-green-500'
            : strategyData.tradeDirection === 'SELL'
              ? 'text-red-500'
              : 'text-neutral-50'

    const allocationLabel =
        strategyData.capitalAllocationType === 'PERCENTAGE_OF_PORTFOLIO'
            ? `${strategyData.allocationValue}%`
            : `$${strategyData.allocationValue.toLocaleString()}`

    const positionSizingValue =
        strategyData.positionSizingMethod === 'FIXED'
            ? `$${strategyData.fixedTradeAmount ?? '-'}`
            : `${strategyData.capitalPercentagePerTrade ?? '-'}%`

    return (
        <div className="relative overflow-hidden">
            <div className="absolute -bottom-[20%] left-[50%] -z-1 -translate-x-1/2">
                <div className="h-200 w-200 rounded-full bg-linear-to-b from-blue-900 to-blue-800 blur-[500px]" />
            </div>
            <div className="z-1 space-y-6 p-5">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h4 className="text-2xl font-semibold text-neutral-50">{strategyData.name}</h4>

                        <Badge
                            variant={isLiveStatus(status) ? 'success' : 'outline'}
                            className={`rounded-[40px] bg-neutral-950 px-5 py-2 text-xs font-medium capitalize ${
                                isLiveStatus(status) ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                            {status}
                        </Badge>

                        <button
                            onClick={handleToggleStatus}
                            className="flex items-center gap-2 rounded-[40px] border border-white/30 px-6 py-3 text-base text-neutral-50 hover:bg-white/5"
                        >
                            {isLiveStatus(status) ? (
                                <StopCircle size={20} className="text-red-500" />
                            ) : (
                                <PlayCircle size={20} className="text-green-500" variant="Bold" />
                            )}
                            {isLiveStatus(status) ? 'Stop' : 'Run'}
                        </button>
                    </div>

                    {!isLiveStatus(status) && (
                        <Button onClick={handleEdit} variant="secondary" className="border-neutral-700">
                            <Edit size={20} className="mr-2 mb-1 inline" />
                            Edit Strategy
                        </Button>
                    )}
                </div>

                <Separator />

                {/* Strategy Details */}
                <div className="space-y-3 rounded-lg bg-white/5 p-6">
                    <h3 className="text-base font-semibold text-neutral-50">Strategy Details</h3>
                    <Separator />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                            { label: 'Symbol', value: strategyData.symbol, color: 'text-blue-400' },
                            { label: 'Timeframe', value: strategyData.timeframe },
                            { label: 'Trade Direction', value: strategyData.tradeDirection, color: directionColor },
                            { label: 'Capital Allocation', value: `${strategyData.capitalAllocationType} — ${allocationLabel}` },
                            { label: 'Leverage', value: `${strategyData.leverage}x` },
                            { label: 'Max Open Positions', value: String(strategyData.maxOpenPositions) },
                            { label: 'Position Sizing', value: `${strategyData.positionSizingMethod} — ${positionSizingValue}` },
                            { label: 'Candle Type', value: strategyData.candleType },
                            { label: 'Margin Type', value: strategyData.marginType },
                            { label: 'Min Signal Agreement', value: String(strategyData.minSignalAgreement) },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="flex gap-2 text-sm">
                                <span className="text-neutral-400">{label}:</span>
                                <span className={`font-semibold ${color ?? 'text-neutral-50'}`}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Risk Management */}
                {strategyData.risk && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-neutral-50">Risk Management</h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {strategyData.risk.stopLoss && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <h4 className="font-semibold text-neutral-50">Stop Loss</h4>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-2"><span className="text-neutral-400">Type:</span><span className="font-semibold text-neutral-50">{strategyData.risk.stopLoss.type}</span></div>
                                        {strategyData.risk.stopLoss.type === 'FIXED_PERCENTAGE' && strategyData.risk.stopLoss.fixedPercentage != null && (
                                            <div className="flex gap-2"><span className="text-neutral-400">Fixed %:</span><span className="font-semibold text-neutral-50">{strategyData.risk.stopLoss.fixedPercentage}%</span></div>
                                        )}
                                        {strategyData.risk.stopLoss.type === 'STRUCTURAL' && strategyData.risk.stopLoss.structuralLookback != null && (
                                            <div className="flex gap-2"><span className="text-neutral-400">Lookback:</span><span className="font-semibold text-neutral-50">{strategyData.risk.stopLoss.structuralLookback} candles</span></div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {strategyData.risk.takeProfit && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <h4 className="font-semibold text-neutral-50">Take Profit</h4>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-2"><span className="text-neutral-400">Type:</span><span className="font-semibold text-neutral-50">{strategyData.risk.takeProfit.type}</span></div>
                                        {strategyData.risk.takeProfit.type === 'FIXED_PERCENTAGE' && strategyData.risk.takeProfit.fixedPercentage != null && (
                                            <div className="flex gap-2"><span className="text-neutral-400">Fixed %:</span><span className="font-semibold text-neutral-50">{strategyData.risk.takeProfit.fixedPercentage}%</span></div>
                                        )}
                                        {strategyData.risk.takeProfit.type === 'RISK_REWARD' && strategyData.risk.takeProfit.riskRewardRatio != null && (
                                            <div className="flex gap-2"><span className="text-neutral-400">R:R Ratio:</span><span className="font-semibold text-neutral-50">{strategyData.risk.takeProfit.riskRewardRatio}</span></div>
                                        )}
                                        {strategyData.risk.takeProfit.type === 'MULTI_LEVEL' && strategyData.risk.takeProfit.partialLevels && (
                                            <div className="space-y-1">
                                                {strategyData.risk.takeProfit.partialLevels.map((lvl, i) => (
                                                    <div key={i} className="flex gap-2"><span className="text-neutral-400">Level {i + 1}:</span><span className="font-semibold text-neutral-50">Trigger {lvl.triggerPercentage}% / Close {lvl.closePercentage}%</span></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {strategyData.risk.trailingStop && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <h4 className="font-semibold text-neutral-50">Trailing Stop</h4>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-2"><span className="text-neutral-400">Enabled:</span><span className={`font-semibold ${strategyData.risk.trailingStop.enabled ? 'text-green-500' : 'text-red-500'}`}>{strategyData.risk.trailingStop.enabled ? 'Yes' : 'No'}</span></div>
                                        {strategyData.risk.trailingStop.enabled && strategyData.risk.trailingStop.trailingPercentage != null && (
                                            <div className="flex gap-2"><span className="text-neutral-400">Trailing %:</span><span className="font-semibold text-neutral-50">{strategyData.risk.trailingStop.trailingPercentage}%</span></div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {strategyData.risk.breakEven && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <h4 className="font-semibold text-neutral-50">Break-Even</h4>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-2"><span className="text-neutral-400">Enabled:</span><span className={`font-semibold ${strategyData.risk.breakEven.enabled ? 'text-green-500' : 'text-red-500'}`}>{strategyData.risk.breakEven.enabled ? 'Yes' : 'No'}</span></div>
                                        {strategyData.risk.breakEven.enabled && (
                                            <>
                                                {strategyData.risk.breakEven.triggerPercentage != null && (
                                                    <div className="flex gap-2"><span className="text-neutral-400">Trigger:</span><span className="font-semibold text-neutral-50">{strategyData.risk.breakEven.triggerPercentage}%</span></div>
                                                )}
                                                {strategyData.risk.breakEven.offsetPercentage != null && (
                                                    <div className="flex gap-2"><span className="text-neutral-400">Offset:</span><span className="font-semibold text-neutral-50">{strategyData.risk.breakEven.offsetPercentage}%</span></div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <Separator />

                {/* Indicators */}
                {strategyData.indicators && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-neutral-50">Indicators</h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {strategyData.indicators.rsi && strategyData.indicators.rsi.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <div className="flex items-center justify-between"><h4 className="font-semibold text-neutral-50">RSI</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.rsi.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.rsi.period != null && <div className="flex gap-2"><span className="text-neutral-400">Period:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.rsi.period}</span></div>}
                                        {strategyData.indicators.rsi.source && <div className="flex gap-2"><span className="text-neutral-400">Source:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.rsi.source}</span></div>}
                                        {strategyData.indicators.rsi.smoothingType && <div className="flex gap-2"><span className="text-neutral-400">Smoothing:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.rsi.smoothingType}</span></div>}
                                        {strategyData.indicators.rsi.overboughtLevel != null && <div className="flex gap-2"><span className="text-neutral-400">Overbought:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.rsi.overboughtLevel}</span></div>}
                                        {strategyData.indicators.rsi.oversoldLevel != null && <div className="flex gap-2"><span className="text-neutral-400">Oversold:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.rsi.oversoldLevel}</span></div>}
                                    </div>
                                </div>
                            )}

                            {strategyData.indicators.utBot && strategyData.indicators.utBot.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <div className="flex items-center justify-between"><h4 className="font-semibold text-neutral-50">UT Bot</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.utBot.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.utBot.atrPeriod != null && <div className="flex gap-2"><span className="text-neutral-400">ATR Period:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.utBot.atrPeriod}</span></div>}
                                        {strategyData.indicators.utBot.atrMultiplier != null && <div className="flex gap-2"><span className="text-neutral-400">ATR Multiplier:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.utBot.atrMultiplier}</span></div>}
                                    </div>
                                </div>
                            )}

                            {strategyData.indicators.superTrend && strategyData.indicators.superTrend.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <div className="flex items-center justify-between"><h4 className="font-semibold text-neutral-50">Supertrend</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.superTrend.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.superTrend.atrPeriod != null && <div className="flex gap-2"><span className="text-neutral-400">ATR Period:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.superTrend.atrPeriod}</span></div>}
                                        {strategyData.indicators.superTrend.atrMultiplier != null && <div className="flex gap-2"><span className="text-neutral-400">ATR Multiplier:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.superTrend.atrMultiplier}</span></div>}
                                        {strategyData.indicators.superTrend.srcPrice && <div className="flex gap-2"><span className="text-neutral-400">Source:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.superTrend.srcPrice}</span></div>}
                                    </div>
                                </div>
                            )}

                            {strategyData.indicators.hullSuite && strategyData.indicators.hullSuite.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <div className="flex items-center justify-between"><h4 className="font-semibold text-neutral-50">Hull Suite</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.hullSuite.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.hullSuite.length != null && <div className="flex gap-2"><span className="text-neutral-400">Length:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.hullSuite.length}</span></div>}
                                        {strategyData.indicators.hullSuite.lengthMultiplier != null && <div className="flex gap-2"><span className="text-neutral-400">Multiplier:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.hullSuite.lengthMultiplier}</span></div>}
                                        {strategyData.indicators.hullSuite.mode && <div className="flex gap-2"><span className="text-neutral-400">Mode:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.hullSuite.mode}</span></div>}
                                    </div>
                                </div>
                            )}

                            {strategyData.indicators.adx && strategyData.indicators.adx.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <div className="flex items-center justify-between"><h4 className="font-semibold text-neutral-50">ADX</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.adx.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.adx.diLength != null && <div className="flex gap-2"><span className="text-neutral-400">DI Length:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.adx.diLength}</span></div>}
                                        {strategyData.indicators.adx.adxLength != null && <div className="flex gap-2"><span className="text-neutral-400">ADX Length:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.adx.adxLength}</span></div>}
                                        {strategyData.indicators.adx.threshold != null && <div className="flex gap-2"><span className="text-neutral-400">Threshold:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.adx.threshold}</span></div>}
                                        {strategyData.indicators.adx.conditionType && <div className="flex gap-2"><span className="text-neutral-400">Condition:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.adx.conditionType}</span></div>}
                                    </div>
                                </div>
                            )}

                            {strategyData.indicators.squeezeMomentum && strategyData.indicators.squeezeMomentum.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-5">
                                    <div className="flex items-center justify-between"><h4 className="font-semibold text-neutral-50">Squeeze Momentum</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.squeezeMomentum.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.squeezeMomentum.bollingerBandsPeriod != null && <div className="flex gap-2"><span className="text-neutral-400">BB Period:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.squeezeMomentum.bollingerBandsPeriod}</span></div>}
                                        {strategyData.indicators.squeezeMomentum.bollingerBandsMultiplier != null && <div className="flex gap-2"><span className="text-neutral-400">BB Multiplier:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.squeezeMomentum.bollingerBandsMultiplier}</span></div>}
                                        {strategyData.indicators.squeezeMomentum.keltnerChannelPeriod != null && <div className="flex gap-2"><span className="text-neutral-400">KC Period:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.squeezeMomentum.keltnerChannelPeriod}</span></div>}
                                        {strategyData.indicators.squeezeMomentum.keltnerChannelMultiplier != null && <div className="flex gap-2"><span className="text-neutral-400">KC Multiplier:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.squeezeMomentum.keltnerChannelMultiplier}</span></div>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Strategy Exits */}
                {strategyData.strategyExits && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-neutral-50">Strategy Exits</h3>
                            <div className="grid grid-cols-1 gap-3 rounded-lg bg-white/5 p-5 sm:grid-cols-2">
                                {[
                                    { label: 'Exit on Opposite Signal', value: strategyData.strategyExits.onOppositeSignal },
                                    { label: 'Exit on Trend Change', value: strategyData.strategyExits.onTrendChange },
                                    { label: 'Allow Re-Entry on Active Signal', value: strategyData.strategyExits.allowReEntryOnActiveSignal },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex gap-2 text-sm">
                                        <span className="text-neutral-400">{label}:</span>
                                        <span className={`font-semibold ${value ? 'text-green-500' : 'text-red-500'}`}>{value ? 'Yes' : 'No'}</span>
                                    </div>
                                ))}
                                {strategyData.strategyExits.allowReEntryOnActiveSignal && strategyData.strategyExits.reEntryCooldownBars != null && (
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-neutral-400">Re-Entry Cooldown:</span>
                                        <span className="font-semibold text-neutral-50">{strategyData.strategyExits.reEntryCooldownBars} bars</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Delete Button */}
                <div className="pt-4">
                    <Button
                        variant="secondary"
                        onClick={handleDelete}
                        className="bg-transparent text-red-500 hover:bg-red-500 hover:text-white border-red-500"
                    >
                        <Trash size={20} className="mr-2 mb-1 inline" />
                        Delete Strategy
                    </Button>
                </div>
            </div>
        </div>
    )
}
