import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/Separator'
import { Edit, PlayCircle, Trash } from 'iconsax-reactjs'
import { StopCircle } from 'lucide-react'
import { useState } from 'react'

type StrategyDetailsTabProps = {
    strategyData: {
        strategyName: string
        status: 'running' | 'stopped'
        tradingPair: string
        timeframe: string
        tradeDirection: string
        openPositions: number
        allocatedCapital: number
        leverage: string
        todaysPnL: number
        lastTrade: string
    }
}

export default function StrategyDetailsTab({ strategyData }: StrategyDetailsTabProps) {
    const [status, setStatus] = useState(strategyData.status)

    const handleToggleStatus = () => {
        setStatus((prev) => (prev === 'running' ? 'stopped' : 'running'))
    }

    const handleEdit = () => {
        console.log('Edit strategy')
    }

    const handleDelete = () => {
        console.log('Delete strategy')
    }

    /* -------------------- Strategy Details -------------------- */

    const strategyDetails = {
        'Trading Pair': strategyData.tradingPair,
        Timeframe: strategyData.timeframe,
        'Trade Direction': strategyData.tradeDirection,
        'Open Positions': strategyData.openPositions,
        'Allocated Capital': `$${strategyData.allocatedCapital.toLocaleString()}`,
        Leverage: strategyData.leverage,
        "Today's PnL": `${strategyData.todaysPnL >= 0 ? '+' : ''}$${strategyData.todaysPnL}`,
        'Last Trade': strategyData.lastTrade,
    }

    /* -------------------- Risk Management -------------------- */

    const riskManagement = [
        {
            title: 'Stop Loss Configuration',
            items: {
                'Stop Loss Type': 'Fixed',
                'Stop Loss (%)': '20%',
            },
        },
        {
            title: 'Take Profit Configuration',
            items: {
                'Take Profit Type': 'Percentage',
                'Trail Start': '10%',
                'Lookback Period': '10 Candles',
            },
        },
        {
            title: 'Break-Even Protection',
            items: {
                'Trigger Profit %': '10%',
                Offset: '0.2%',
            },
        },
    ]

    /* -------------------- Indicators -------------------- */

    const indicators = [
        {
            title: 'RSI',
            items: {
                'RSI Period:': '14',
                Source: 'Close',
                'Smoothing Type': 'RMA',
                'Smoothing Length': '14',
                'Overbought Level': '70',
                'Oversold Level': '30',
            },
        },
        {
            title: 'UT Bot',
            items: {
                'ATR Period': '10',
                'ATR Multiplier': '70',
            },
        },
        {
            title: 'Supertrend',
            items: {
                'ATR Period': '10',
                'ATR Multiplier': '70',
                Source: 'HL/2',
                'ATR Calculation Method:': 'RMA',
            },
        },
        {
            title: 'Hull Suite',
            items: {
                'HMA Length': '55',
                'Length Multiplier': '2',
                Mode: 'RMA',
            },
        },
        {
            title: 'ADX',
            items: {
                'DI Length': '14',
                'ADX Smoothing': '14',
                'Condition Type': 'ADX Greater Than',
                'Trend Strength': 'Strong',
            },
        },
        {
            title: 'Squeeze Momentum',
            items: {
                'Bollinger Band Period': '20',
                'Bollinger Band Multiplier': '2',
                'Keltner Channel Period': '20',
                'Keltner Channel Multiplier': '1.5',
                'Use TrueRange (KC)': 'ON',
            },
        },
    ]

    return (
        <div className="relative overflow-hidden">
            <div className="absolute -bottom-[20%] left-[50%] -z-1 -translate-x-1/2">
                <div className="h-200 w-200 rounded-full bg-linear-to-b from-blue-900 to-blue-800 blur-[500px]" />
            </div>
            <div className="z-1 space-y-6 p-5">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h4 className="text-2xl font-semibold text-neutral-50">{strategyData.strategyName}</h4>

                        <Badge
                            variant={status === 'running' ? 'success' : 'outline'}
                            className={`rounded-[40px] bg-neutral-950 px-5 py-2 text-xs font-medium capitalize ${
                                status === 'running' ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                            {status}
                        </Badge>

                        <button
                            onClick={handleToggleStatus}
                            className="flex items-center gap-2 rounded-[40px] border border-white/30 px-6 py-3 text-base text-neutral-50 hover:bg-white/5"
                        >
                            {status === 'running' ? (
                                <StopCircle size={20} className="text-red-500" />
                            ) : (
                                <PlayCircle size={20} className="text-green-500" variant="Bold" />
                            )}

                            {status === 'running' ? 'Stop' : 'Run'}
                        </button>
                    </div>

                    {status === 'stopped' && (
                        <Button onClick={handleEdit} variant="secondary" className="border-neutral-700">
                            <Edit size={20} className="mr-2 mb-1 inline" />
                            Edit Strategy
                        </Button>
                    )}
                </div>

                <Separator />

                {/* Strategy Details */}

                <div className="space-y-3 rounded-lg bg-white/5 p-6">
                    {Object.entries(strategyDetails).map(([key, value]) => {
                        let valueColor = 'text-neutral-50'

                        if (key === "Today's PnL") {
                            valueColor = value.toString().startsWith('+') ? 'text-green-500' : 'text-red-500'
                        }

                        if (key === 'Trading Pair') {
                            valueColor = 'text-blue-700'
                        }

                        if (key === 'Trade Direction') {
                            valueColor =
                                value === 'Long'
                                    ? 'text-green-500'
                                    : value === 'Short'
                                      ? 'text-red-500'
                                      : 'text-neutral-50'
                        }

                        return (
                            <div key={key} className="flex gap-2 text-lg">
                                <span className="text-neutral-300">{key}:</span>
                                <span className={`font-bold ${valueColor}`}>{value}</span>
                            </div>
                        )
                    })}
                </div>

                <Separator />

                {/* Risk Management */}

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-50">Risk Management</h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {riskManagement.map((section) => (
                            <div key={section.title} className="space-y-3 rounded-lg bg-white/5 p-6">
                                <h3 className="text-base font-semibold text-neutral-50">{section.title}</h3>

                                <Separator />

                                <div className="space-y-2">
                                    {Object.entries(section.items).map(([key, value]) => (
                                        <div key={key} className="flex gap-2 text-lg">
                                            <span className="font-medium text-neutral-300">{key}:</span>
                                            <span className="font-bold text-neutral-50">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Indicators */}

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-50">Indicators</h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {indicators.map((indicator) => (
                            <div key={indicator.title} className="space-y-3 rounded-lg bg-white/5 p-6">
                                <h3 className="text-base font-semibold text-neutral-50">{indicator.title}</h3>

                                <Separator />

                                <div className="space-y-2">
                                    {Object.entries(indicator.items).map(([key, value]) => (
                                        <div key={key} className="flex gap-2 text-lg">
                                            <span className="font-medium text-neutral-300">{key}:</span>
                                            <span className="font-bold text-neutral-50">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

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
