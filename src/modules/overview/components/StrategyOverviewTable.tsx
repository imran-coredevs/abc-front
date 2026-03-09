import Table from '@/components/ui/table/table'
import TableHeader from '@/components/ui/table/table-header'
import { cn } from '@/lib/utils'

type Strategy = {
    strategyName: string
    tradingPair: string
    timeframe: string
    direction: 'Long' | 'Short' | 'Both'
    openPositions: number
    allocatedCapital: number
    leverage: string
    todaysPnL: number
    lastTrade: string
    status: 'Running' | 'Stopped' | 'Draft'
}

const dummyStrategies: Strategy[] = [
    {
        strategyName: 'Momentum Breakout',
        tradingPair: 'BTC/USDT',
        timeframe: '15m',
        direction: 'Long',
        openPositions: 2,
        allocatedCapital: 5000,
        leverage: '5x',
        todaysPnL: 245.5,
        lastTrade: '2h ago',
        status: 'Stopped',
    },
    {
        strategyName: 'Mean Reversion',
        tradingPair: 'ETH/USDT',
        timeframe: '1h',
        direction: 'Both',
        openPositions: 1,
        allocatedCapital: 3500,
        leverage: '3x',
        todaysPnL: 182.75,
        lastTrade: '10m ago',
        status: 'Running',
    },
    {
        strategyName: 'Grid Trading',
        tradingPair: 'BNB/USDT',
        timeframe: '5m',
        direction: 'Both',
        openPositions: 0,
        allocatedCapital: 2000,
        leverage: '2x',
        todaysPnL: -45.2,
        lastTrade: '--- · ---',
        status: 'Draft',
    },
    {
        strategyName: 'Scalping Pro',
        tradingPair: 'SOL/USDT',
        timeframe: '1m',
        direction: 'Short',
        openPositions: 3,
        allocatedCapital: 4000,
        leverage: '10x',
        todaysPnL: 312.0,
        lastTrade: '--- · ---',
        status: 'Running',
    },
    {
        strategyName: 'Swing Strategy',
        tradingPair: 'MATIC/USDT',
        timeframe: '4h',
        direction: 'Long',
        openPositions: 0,
        allocatedCapital: 1500,
        leverage: '2x',
        todaysPnL: -22.5,
        lastTrade: '--- · ---',
        status: 'Draft',
    },
    {
        strategyName: 'Arbitrage Hunter',
        tradingPair: 'ADA/USDT',
        timeframe: '30m',
        direction: 'Both',
        openPositions: 1,
        allocatedCapital: 2500,
        leverage: '4x',
        todaysPnL: 165.8,
        lastTrade: '--- · ---',
        status: 'Running',
    },
]

// Status badge component matching Figma TokenPairs design
const StatusBadge = ({ status }: { status: Strategy['status'] }) => {
    const statusStyles = {
        Running: 'bg-green-600/10 text-green-500',
        Stopped: 'bg-red-600/10 text-red-500',
        Draft: 'bg-neutral-800 text-neutral-400',
    }

    return (
        <div
            className={cn(
                'flex items-center justify-center rounded-[40px] px-5 py-2 text-sm font-bold',
                statusStyles[status],
            )}
        >
            {status}
        </div>
    )
}

// Direction badge component with color coding
const DirectionBadge = ({ direction }: { direction: Strategy['direction'] }) => {
    const directionStyles = {
        Long: 'text-green-500',
        Short: 'text-red-500',
        Both: 'text-violet-500',
    }

    return <span className={cn('text-sm font-medium', directionStyles[direction])}>{direction}</span>
}

const columns: TableColumn<Strategy>[] = [
    {
        title: 'Strategy Name',
        key: 'strategyName',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-medium text-neutral-50">{row.strategyName}</span>,
    },
    {
        title: 'Trading Pair',
        key: 'tradingPair',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-50">{row.tradingPair}</span>,
    },
    {
        title: 'Timeframe',
        key: 'timeframe',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-50">{row.timeframe}</span>,
    },
    {
        title: 'Direction',
        key: 'direction',
        type: 'dynamic',
        render: (row) => <DirectionBadge direction={row.direction} />,
    },
    {
        title: 'Open Positions',
        key: 'openPositions',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-50">{row.openPositions}</span>,
    },
    {
        title: 'Allocated Capital',
        key: 'allocatedCapital',
        type: 'dynamic',
        render: (row) => (
            <span className="text-sm font-normal text-neutral-50">${row.allocatedCapital.toLocaleString()}</span>
        ),
    },
    {
        title: 'Leverage',
        key: 'leverage',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-50">{row.leverage}</span>,
    },
    {
        title: "Today's PnL",
        key: 'todaysPnL',
        type: 'dynamic',
        render: (row) => (
            <span className={cn('text-sm font-normal', row.todaysPnL >= 0 ? 'text-green-500' : 'text-red-500')}>
                {row.todaysPnL >= 0 ? '+' : ''}${row.todaysPnL.toFixed(2)}
            </span>
        ),
    },
    {
        title: 'Last Trade',
        key: 'lastTrade',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-50">{row.lastTrade}</span>,
    },
    {
        title: 'Status',
        key: 'status',
        type: 'dynamic',
        render: (row) => <StatusBadge status={row.status} />,
    },
]

export default function StrategyOverviewTable() {
    return (
        <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <TableHeader title="Strategy Overview" />
            <div className="mt-6">
                <Table columns={columns} tableData={dummyStrategies} />
            </div>
        </div>
    )
}
