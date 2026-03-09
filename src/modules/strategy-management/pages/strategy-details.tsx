import { useState } from 'react'
import { useParams } from 'react-router'
import StrategyDetailsTop from '../components/StrategyDetailsTop'
import StrategyDetailsTab from '../components/StrategyDetailsTab'
import BacktestingTab from '../components/BacktestingTab'
import StrategyTabs from '../components/StrategyTabs'

export default function StrategyDetailsPage() {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState<'details' | 'backtesting'>('details')

    // Mock strategy data - in real app, fetch based on id
    const strategyData = {
        strategyName: 'Momentum Breakout',
        status: 'running' as 'running' | 'stopped',
        tradingPair: 'BTC/USDT',
        timeframe: '15m',
        tradeDirection: 'Long',
        openPositions: 2,
        allocatedCapital: 5000,
        leverage: '5x',
        todaysPnL: 245.50,
        lastTrade: '2 hours ago',
    }

    return (
        <div>
            <StrategyDetailsTop />

            <div className='bg-white/5 rounded-xl p-5 mt-8'>
                {/* Tabs */}
               <StrategyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'details' ? <StrategyDetailsTab strategyData={strategyData} /> : <BacktestingTab />}
                </div>
            </div>
        </div>
    )
}
