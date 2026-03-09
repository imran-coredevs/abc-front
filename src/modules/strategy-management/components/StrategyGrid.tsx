import { useState } from 'react'
import { useNavigate } from 'react-router'
import StrategyCard from './StrategyCard'

type Strategy = {
    id: string
    apiKey: string
    strategyName: string
    status: 'Running' | 'Stopped'
    pair: string
    direction: 'Long' | 'Short' | 'Both'
    allocation: number
}

const dummyStrategies: Strategy[] = [
    {
        id: '1',
        apiKey: 'binance-api-1157f8e9a4b3c2d1e0f9a8b7c6d5e4f3',
        strategyName: 'Momentum Breakout',
        status: 'Running',
        pair: 'BTC/USDT',
        direction: 'Long',
        allocation: 5000,
    },
    {
        id: '2',
        apiKey: 'binance-api-2268a9f0b5c4d3e2f1a0b9c8d7e6f5a4',
        strategyName: 'Mean Reversion',
        status: 'Running',
        pair: 'ETH/USDT',
        direction: 'Both',
        allocation: 3500,
    },
    {
        id: '3',
        apiKey: 'binance-api-3379b0a1c6d5e4f3a2b1c0d9e8f7a6b5',
        strategyName: 'Grid Trading',
        status: 'Stopped',
        pair: 'BNB/USDT',
        direction: 'Both',
        allocation: 2000,
    },
    {
        id: '4',
        apiKey: 'binance-api-4480c1b2d7e6f5a4b3c2d1e0f9a8b7c6',
        strategyName: 'Scalping Pro',
        status: 'Running',
        pair: 'SOL/USDT',
        direction: 'Short',
        allocation: 4000,
    },
    {
        id: '5',
        apiKey: 'binance-api-5591d2c3e8f7a6b5c4d3e2f1a0b9c8d7',
        strategyName: 'Swing Strategy',
        status: 'Stopped',
        pair: 'MATIC/USDT',
        direction: 'Long',
        allocation: 1500,
    },
    {
        id: '6',
        apiKey: 'binance-api-6602e3d4f9a8b7c6d5e4f3a2b1c0d9e8',
        strategyName: 'Arbitrage Hunter',
        status: 'Running',
        pair: 'ADA/USDT',
        direction: 'Both',
        allocation: 2500,
    },
    {
        id: '7',
        apiKey: 'binance-api-7713f4e5a0b9c8d7e6f5a4b3c2d1e0f9',
        strategyName: 'Trend Follower',
        status: 'Stopped',
        pair: 'XRP/USDT',
        direction: 'Long',
        allocation: 3000,
    },
    {
        id: '8',
        apiKey: 'binance-api-8824a5f6b1c0d9e8f7a6b5c4d3e2f1a0',
        strategyName: 'Volatility Master',
        status: 'Running',
        pair: 'AVAX/USDT',
        direction: 'Short',
        allocation: 3200,
    },
]

export default function StrategyGrid() {
    const [strategies, setStrategies] = useState<Strategy[]>(dummyStrategies)
    const navigate = useNavigate()

    const handleToggleStatus = (id: string) => {
        setStrategies((prev) =>
            prev.map((strategy) =>
                strategy.id === id
                    ? {
                          ...strategy,
                          status: strategy.status === 'Running' ? 'Stopped' : 'Running',
                      }
                    : strategy,
            ),
        )
    }

    const handleViewDetails = (id: string) => {
        navigate(`/strategy-management/${id}`)
    }

    return (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {strategies.map((strategy) => (
                <StrategyCard
                    key={strategy.id}
                    apiKey={strategy.apiKey}
                    strategyName={strategy.strategyName}
                    status={strategy.status}
                    pair={strategy.pair}
                    direction={strategy.direction}
                    allocation={strategy.allocation}
                    onToggleStatus={() => handleToggleStatus(strategy.id)}
                    onViewDetails={() => handleViewDetails(strategy.id)}
                />
            ))}
        </div>
    )
}
