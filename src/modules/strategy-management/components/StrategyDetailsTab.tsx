import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/Separator'
import { instanceService } from '@/services/instanceService'
import { Edit, PlayCircle, Trash } from 'iconsax-reactjs'
import { StopCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import toast from 'react-hot-toast'

type StrategyData = {
    name: string
    status: 'LIVE' | 'STOPPED' | 'DRAFT' | 'STARTING' | 'STOPPING' | 'BACKTESTING'
    symbols: string[]
    timeframe: string
    tradeDirection: 'LONG' | 'SHORT' | 'BOTH'
    capitalAllocationType: 'PERCENTAGE_OF_PORTFOLIO' | 'FIXED_AMOUNT'
    allocationValue: number
    leverage: number
    maxOpenPositions: number
    maxPortfolioExposurePercentage?: number
    positionSizingMethod: 'FIXED' | 'PERCENTAGE'
    fixedTradeAmount?: number
    capitalPercentagePerTrade?: number
    candleType: 'STANDARD' | 'HEIKIN_ASHI'
    minSignalAgreement: number
    risk?: {
        stopLoss?: { type: string; fixedPercentage?: number; structuralLookback?: number; structuralBufferPercent?: number; structuralMaxDistancePercent?: number }
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
    const [isToggling, setIsToggling] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()

    const handleToggleStatus = async () => {
        if (!id) return
        
        // Disable button immediately to prevent race condition
        setIsToggling(true)

        try {
            if (isLiveStatus(status)) {
                await instanceService.stopInstance(id, 'User manual stop')
                toast.success('Strategy stopping...')
                toast('Instance is STOPPING. Existing Binance positions may remain live until all close orders are confirmed.', {
                    icon: '⚠️',
                })
                setStatus('STOPPING')
            } else {
                await instanceService.startInstance(id)
                toast.success('Strategy started successfully')
                setStatus('STARTING')
            }
        } catch (error: any) {
            console.error('Failed to toggle strategy status:', error)
            toast.error(error?.response?.data?.message || 'Failed to toggle strategy status')
        } finally {
            setIsToggling(false)
        }
    }

    const handleEdit = () => navigate(`/strategy-management/${id}/edit`)

    const handleDelete = async () => {
        if (!id) return
        
        if (!window.confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
            return
        }

        try {
            await instanceService.deleteInstance(id)
            toast.success('Strategy deleted successfully')
            navigate('/strategy-management')
        } catch (error: any) {
            console.error('Failed to delete strategy:', error)
            toast.error(error?.response?.data?.message || 'Failed to delete strategy')
        }
    }

    const directionColor =
        strategyData?.tradeDirection === 'LONG'
            ? 'text-green-500'
            : strategyData?.tradeDirection === 'SHORT'
              ? 'text-red-500'
              : 'text-violet-500'

    const allocationLabel =
        strategyData?.capitalAllocationType === 'PERCENTAGE_OF_PORTFOLIO'
            ? `${strategyData?.allocationValue ?? 0}%`
            : `$${(strategyData?.allocationValue ?? 0)?.toLocaleString()}`

    const positionSizingValue =
        strategyData?.positionSizingMethod === 'FIXED'
            ? `$${strategyData?.fixedTradeAmount ?? '-'}`
            : `${strategyData?.capitalPercentagePerTrade ?? '-'}%`

    return (
        <div className="relative overflow-hidden">
            <div className="absolute -bottom-[20%] left-[50%] -z-1 -translate-x-1/2">
                <div className="h-200 w-200 rounded-full bg-linear-to-b from-blue-900 to-blue-800 blur-[500px]" />
            </div>
            <div className="z-1 space-y-6 p-3 sm:p-5">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl sm:text-2xl font-semibold text-neutral-50">{strategyData?.name ?? 'Unnamed Strategy'}</h4>
                        <Badge
                            variant={isLiveStatus(status) ? 'success' : 'outline'}
                            className={`rounded-[40px] bg-neutral-950 px-4 py-1.5 text-xs font-medium capitalize ${
                                isLiveStatus(status) ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                            {status}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={handleToggleStatus}
                            disabled={isToggling}
                            className={`flex items-center gap-2 rounded-[40px] border border-white/30 px-4 sm:px-6 py-2.5 text-sm sm:text-base text-neutral-50 ${
                                isToggling ? 'cursor-not-allowed opacity-50' : 'hover:bg-white/5'
                            }`}
                        >
                            {isLiveStatus(status) ? (
                                <StopCircle size={18} className="text-red-500" />
                            ) : (
                                <PlayCircle size={18} className="text-green-500" variant="Bold" />
                            )}
                            {isToggling ? 'Processing...' : isLiveStatus(status) ? 'Stop' : 'Run'}
                        </button>

                        {!isLiveStatus(status) && (
                            <Button onClick={handleEdit} variant="secondary" className="border-neutral-700 px-4 sm:px-6 py-2.5 text-sm sm:text-base">
                                <Edit size={18} className="mr-1.5 mb-0.5 inline" />
                                Edit
                            </Button>
                        )}
                    </div>
                </div>

                <Separator />

                {status === 'STOPPING' && (
                    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                        Instance is stopping. Existing Binance positions and protective orders may still be live until closure is fully confirmed.
                    </div>
                )}

                {/* Strategy Details */}
                <div className="space-y-3 rounded-lg bg-white/5 p-4 sm:p-6">
                    <h3 className="text-base font-semibold text-neutral-50">Strategy Details</h3>
                    <Separator />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                            { label: 'Trading Pairs', value: Array.isArray(strategyData?.symbols) ? strategyData.symbols.join(', ') : (strategyData?.symbols ?? 'N/A'), color: 'text-blue-400' },
                            { label: 'Timeframe', value: strategyData?.timeframe ?? 'N/A' },
                            { label: 'Trade Direction', value: strategyData?.tradeDirection ?? 'N/A', color: directionColor },
                            { label: 'Capital Allocation', value: `${strategyData?.capitalAllocationType ?? 'N/A'} — ${allocationLabel}` },
                            { label: 'Leverage', value: `${strategyData?.leverage ?? 1}x` },
                            { label: 'Max Open Positions', value: String(strategyData?.maxOpenPositions ?? 0) },
                            { 
                                label: 'Max Portfolio Exposure', 
                                value: strategyData?.maxPortfolioExposurePercentage === 0 || strategyData?.maxPortfolioExposurePercentage == null
                                    ? 'Unlimited' 
                                    : `${strategyData.maxPortfolioExposurePercentage}%`,
                                color: strategyData?.maxPortfolioExposurePercentage === 0 ? 'text-amber-500' : 'text-neutral-50'
                            },
                            { label: 'Position Sizing', value: `${strategyData?.positionSizingMethod ?? 'N/A'} — ${positionSizingValue}` },
                            { label: 'Candle Type', value: strategyData?.candleType ?? 'N/A' },
                            { label: 'Min Signal Agreement', value: String(strategyData?.minSignalAgreement ?? 0) },
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
                {strategyData?.risk && Object.keys(strategyData.risk).length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-neutral-50">Risk Management</h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {strategyData.risk?.stopLoss && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <h4 className="text-sm sm:text-base font-semibold text-neutral-50">Stop Loss</h4>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-2"><span className="text-neutral-400">Type:</span><span className="font-semibold text-neutral-50">{strategyData.risk?.stopLoss?.type ?? 'N/A'}</span></div>
                                        {strategyData.risk?.stopLoss?.type === 'FIXED_PERCENTAGE' && strategyData.risk.stopLoss.fixedPercentage != null && (
                                            <div className="flex gap-2"><span className="text-neutral-400">Fixed %:</span><span className="font-semibold text-neutral-50">{strategyData.risk.stopLoss.fixedPercentage}%</span></div>
                                        )}
                                        {strategyData.risk?.stopLoss?.type === 'STRUCTURAL' && strategyData.risk.stopLoss.structuralLookback != null && (
                                            <>
                                                <div className="flex gap-2"><span className="text-neutral-400">Lookback:</span><span className="font-semibold text-neutral-50">{strategyData.risk.stopLoss.structuralLookback} candles</span></div>
                                                {strategyData.risk.stopLoss.structuralBufferPercent != null && (
                                                    <div className="flex gap-2"><span className="text-neutral-400">Buffer:</span><span className="font-semibold text-neutral-50">{strategyData.risk.stopLoss.structuralBufferPercent}%</span></div>
                                                )}
                                                {strategyData.risk.stopLoss.structuralMaxDistancePercent != null && (
                                                    <div className="flex gap-2"><span className="text-neutral-400">Max Distance:</span><span className="font-semibold text-neutral-50">{strategyData.risk.stopLoss.structuralMaxDistancePercent}%</span></div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {strategyData.risk?.takeProfit && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <h4 className="text-sm sm:text-base font-semibold text-neutral-50">Take Profit</h4>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-2"><span className="text-neutral-400">Type:</span><span className="font-semibold text-neutral-50">{strategyData.risk?.takeProfit?.type ?? 'N/A'}</span></div>
                                        {strategyData.risk?.takeProfit?.type === 'FIXED_PERCENTAGE' && strategyData.risk.takeProfit.fixedPercentage != null && (
                                            <div className="flex gap-2"><span className="text-neutral-400">Fixed %:</span><span className="font-semibold text-neutral-50">{strategyData.risk.takeProfit.fixedPercentage}%</span></div>
                                        )}
                                        {strategyData.risk?.takeProfit?.type === 'RISK_REWARD' && strategyData.risk.takeProfit.riskRewardRatio != null && (
                                            <div className="flex gap-2"><span className="text-neutral-400">R:R Ratio:</span><span className="font-semibold text-neutral-50">{strategyData.risk.takeProfit.riskRewardRatio}</span></div>
                                        )}
                                        {strategyData.risk?.takeProfit?.type === 'MULTI_LEVEL' && strategyData.risk.takeProfit.partialLevels && Array.isArray(strategyData.risk.takeProfit.partialLevels) && (
                                            <div className="space-y-1">
                                                {strategyData.risk.takeProfit.partialLevels.map((lvl, i) => (
                                                    <div key={i} className="flex gap-2"><span className="text-neutral-400">Level {i + 1}:</span><span className="font-semibold text-neutral-50">Trigger {lvl?.triggerPercentage ?? 0}% / Close {lvl?.closePercentage ?? 0}%</span></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {strategyData.risk?.trailingStop && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <h4 className="text-sm sm:text-base font-semibold text-neutral-50">Trailing Stop</h4>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-2"><span className="text-neutral-400">Enabled:</span><span className={`font-semibold ${strategyData.risk?.trailingStop?.enabled ? 'text-green-500' : 'text-red-500'}`}>{strategyData.risk?.trailingStop?.enabled ? 'Yes' : 'No'}</span></div>
                                        {strategyData.risk?.trailingStop?.enabled && strategyData.risk.trailingStop.trailingPercentage != null && (
                                            <div className="flex gap-2"><span className="text-neutral-400">Trailing %:</span><span className="font-semibold text-neutral-50">{strategyData.risk.trailingStop.trailingPercentage}%</span></div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {strategyData.risk?.breakEven && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <h4 className="text-sm sm:text-base font-semibold text-neutral-50">Break-Even</h4>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-2"><span className="text-neutral-400">Enabled:</span><span className={`font-semibold ${strategyData.risk?.breakEven?.enabled ? 'text-green-500' : 'text-red-500'}`}>{strategyData.risk?.breakEven?.enabled ? 'Yes' : 'No'}</span></div>
                                        {strategyData.risk?.breakEven?.enabled && (
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
                {strategyData?.indicators && Object.keys(strategyData.indicators).length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-neutral-50">Indicators</h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {strategyData.indicators?.rsi && strategyData.indicators.rsi.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <div className="flex items-center justify-between"><h4 className="text-sm sm:text-base font-semibold text-neutral-50">RSI</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.rsi.role}</Badge></div>
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

                            {strategyData.indicators?.utBot && strategyData.indicators.utBot.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <div className="flex items-center justify-between"><h4 className="text-sm sm:text-base font-semibold text-neutral-50">UT Bot</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.utBot.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.utBot.atrPeriod != null && <div className="flex gap-2"><span className="text-neutral-400">ATR Period:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.utBot.atrPeriod}</span></div>}
                                        {strategyData.indicators.utBot.atrMultiplier != null && <div className="flex gap-2"><span className="text-neutral-400">ATR Multiplier:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.utBot.atrMultiplier}</span></div>}
                                    </div>
                                </div>
                            )}

                            {strategyData.indicators?.superTrend && strategyData.indicators.superTrend.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <div className="flex items-center justify-between"><h4 className="text-sm sm:text-base font-semibold text-neutral-50">Supertrend</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.superTrend.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.superTrend.atrPeriod != null && <div className="flex gap-2"><span className="text-neutral-400">ATR Period:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.superTrend.atrPeriod}</span></div>}
                                        {strategyData.indicators.superTrend.atrMultiplier != null && <div className="flex gap-2"><span className="text-neutral-400">ATR Multiplier:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.superTrend.atrMultiplier}</span></div>}
                                        {strategyData.indicators.superTrend.srcPrice && <div className="flex gap-2"><span className="text-neutral-400">Source:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.superTrend.srcPrice}</span></div>}
                                    </div>
                                </div>
                            )}

                            {strategyData.indicators?.hullSuite && strategyData.indicators.hullSuite.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <div className="flex items-center justify-between"><h4 className="text-sm sm:text-base font-semibold text-neutral-50">Hull Suite</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.hullSuite.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.hullSuite.length != null && <div className="flex gap-2"><span className="text-neutral-400">Length:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.hullSuite.length}</span></div>}
                                        {strategyData.indicators.hullSuite.lengthMultiplier != null && <div className="flex gap-2"><span className="text-neutral-400">Multiplier:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.hullSuite.lengthMultiplier}</span></div>}
                                        {strategyData.indicators.hullSuite.mode && <div className="flex gap-2"><span className="text-neutral-400">Mode:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.hullSuite.mode}</span></div>}
                                    </div>
                                </div>
                            )}

                            {strategyData.indicators?.adx && strategyData.indicators.adx.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <div className="flex items-center justify-between"><h4 className="text-sm sm:text-base font-semibold text-neutral-50">ADX</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.adx.role}</Badge></div>
                                    <Separator />
                                    <div className="space-y-1 text-sm">
                                        {strategyData.indicators.adx.diLength != null && <div className="flex gap-2"><span className="text-neutral-400">DI Length:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.adx.diLength}</span></div>}
                                        {strategyData.indicators.adx.adxLength != null && <div className="flex gap-2"><span className="text-neutral-400">ADX Length:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.adx.adxLength}</span></div>}
                                        {strategyData.indicators.adx.threshold != null && <div className="flex gap-2"><span className="text-neutral-400">Threshold:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.adx.threshold}</span></div>}
                                        {strategyData.indicators.adx.conditionType && <div className="flex gap-2"><span className="text-neutral-400">Condition:</span><span className="font-semibold text-neutral-50">{strategyData.indicators.adx.conditionType}</span></div>}
                                    </div>
                                </div>
                            )}

                            {strategyData.indicators?.squeezeMomentum && strategyData.indicators.squeezeMomentum.role !== 'disabled' && (
                                <div className="space-y-3 rounded-lg bg-white/5 p-3 sm:p-5">
                                    <div className="flex items-center justify-between"><h4 className="text-sm sm:text-base font-semibold text-neutral-50">Squeeze Momentum</h4><Badge variant="outline" className="text-xs text-blue-400">{strategyData.indicators.squeezeMomentum.role}</Badge></div>
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
                {strategyData?.strategyExits && Object.keys(strategyData.strategyExits).length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-neutral-50">Strategy Exits</h3>
                            <div className="grid grid-cols-1 gap-3 rounded-lg bg-white/5 p-5 sm:grid-cols-2">
                                {[
                                    { label: 'Exit on Opposite Signal', value: strategyData.strategyExits?.onOppositeSignal },
                                    { label: 'Exit on Trend Change', value: strategyData.strategyExits?.onTrendChange },
                                    { label: 'Allow Re-Entry on Active Signal', value: strategyData.strategyExits?.allowReEntryOnActiveSignal },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex gap-2 text-sm">
                                        <span className="text-neutral-400">{label}:</span>
                                        <span className={`font-semibold ${value ? 'text-green-500' : 'text-red-500'}`}>{value ? 'Yes' : 'No'}</span>
                                    </div>
                                ))}
                                {strategyData.strategyExits?.allowReEntryOnActiveSignal && strategyData.strategyExits.reEntryCooldownBars != null && (
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
