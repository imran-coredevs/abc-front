import { useState } from 'react'
import { useParams } from 'react-router'
import StrategyDetailsTop from '../components/StrategyDetailsTop'
import StrategyDetailsTab from '../components/StrategyDetailsTab'
import BacktestingTab from '../components/BacktestingTab'
import StrategyTabs from '../components/StrategyTabs'

export default function StrategyDetailsPage() {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState<'details' | 'backtesting'>('details')

    // Mock strategy data aligned to backend schema
    const strategyData = {
        name: 'Momentum Breakout',
        status: 'LIVE' as const,
        symbol: 'BTCUSDT',
        timeframe: '15m',
        tradeDirection: 'BOTH' as const,
        capitalAllocationType: 'FIXED_AMOUNT' as const,
        allocationValue: 5000,
        leverage: 5,
        maxOpenPositions: 2,
        positionSizingMethod: 'PERCENTAGE' as const,
        capitalPercentagePerTrade: 10,
        candleType: 'STANDARD' as const,
        marginType: 'CROSSED' as const,
        minSignalAgreement: 2,
        risk: {
            stopLoss: { type: 'FIXED_PERCENTAGE', fixedPercentage: 2 },
            takeProfit: { type: 'FIXED_PERCENTAGE', fixedPercentage: 4 },
            trailingStop: { enabled: false },
            breakEven: { enabled: true, triggerPercentage: 1, offsetPercentage: 0.1 },
        },
        indicators: {
            rsi: { role: 'signal', period: 14, overboughtLevel: 70, oversoldLevel: 30, source: 'close', smoothingType: 'None' },
            utBot: { role: 'signal', atrPeriod: 10, atrMultiplier: 1 },
            superTrend: { role: 'disabled' },
            hullSuite: { role: 'disabled' },
            adx: { role: 'filterOnly', diLength: 14, adxLength: 14, threshold: 25, conditionType: 'Above' },
            squeezeMomentum: { role: 'disabled' },
        },
        strategyExits: {
            onOppositeSignal: true,
            onTrendChange: false,
            allowReEntryOnActiveSignal: false,
            reEntryCooldownBars: 1,
        },
    }

    return (
        <div>
            <StrategyDetailsTop />

            <div className='bg-white/5 rounded-xl p-5 mt-8'>
                <StrategyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-6">
                    {activeTab === 'details' ? <StrategyDetailsTab strategyData={strategyData} /> : <BacktestingTab />}
                </div>
            </div>
        </div>
    )
}
