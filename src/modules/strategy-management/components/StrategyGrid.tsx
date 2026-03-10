import { useStrategyStore } from '@/store/useStrategyStore'
import { useNavigate } from 'react-router'
import StrategyCard from './StrategyCard'

function formatSymbol(symbol: string): string {
    if (symbol.endsWith('USDT')) return `${symbol.slice(0, -4)}/USDT`
    if (symbol.endsWith('BUSD')) return `${symbol.slice(0, -4)}/BUSD`
    return symbol
}

function mapDirection(dir: string): 'Long' | 'Short' | 'Both' {
    if (dir === 'BUY') return 'Long'
    if (dir === 'SELL') return 'Short'
    return 'Both'
}

export default function StrategyGrid() {
    const { strategies, toggleStatus } = useStrategyStore()
    const navigate = useNavigate()

    return (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {strategies.map((strategy) => (
                <StrategyCard
                    key={strategy.id}
                    apiKey={strategy.apiKey}
                    strategyName={strategy.formData.name}
                    status={strategy.status === 'LIVE' ? 'Running' : 'Stopped'}
                    pair={formatSymbol(strategy.formData.symbol)}
                    direction={mapDirection(strategy.formData.tradeDirection)}
                    allocation={strategy.formData.allocationValue}
                    onToggleStatus={() => toggleStatus(strategy.id)}
                    onViewDetails={() => navigate(`/strategy-management/${strategy.id}`)}
                />
            ))}
        </div>
    )
}
