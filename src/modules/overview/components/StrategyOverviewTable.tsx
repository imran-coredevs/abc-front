import Table from '@/components/ui/table/table'
import TableHeader from '@/components/ui/table/table-header'
import { cn } from '@/lib/utils'
import { InstanceOverview } from '@/services/instanceService'

interface StrategyOverviewTableProps {
    data: InstanceOverview[]
    isLoading: boolean
}

// Status badge component matching Figma TokenPairs design
const StatusBadge = ({ status, openPositions }: { status: InstanceOverview['status']; openPositions: number }) => {
    const statusStyles = {
        LIVE: 'bg-green-600/10 text-green-500',
        STOPPED: 'bg-red-600/10 text-red-500',
        DRAFT: 'bg-neutral-800 text-neutral-400',
        STARTING: 'bg-yellow-600/10 text-yellow-500',
        STOPPING: 'bg-orange-600/10 text-orange-500',
    }

    const statusLabels = {
        LIVE: 'Running',
        STOPPED: 'Stopped',
        DRAFT: 'Draft',
        STARTING: 'Starting',
        STOPPING: 'Stopping',
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className={cn(
                    'flex items-center justify-center rounded-[40px] px-5 py-2 text-sm font-bold',
                    statusStyles[status],
                )}
            >
                {statusLabels[status]}
            </div>
            {status === 'STOPPING' && openPositions > 0 && (
                <span className="text-[11px] font-medium text-amber-400">
                    {openPositions} live position(s) closing
                </span>
            )}
        </div>
    )
}

// Direction badge component with color coding
const DirectionBadge = ({ direction }: { direction: InstanceOverview['direction'] }) => {
    const directionStyles = {
        LONG: 'text-green-500',
        SHORT: 'text-red-500',
        BOTH: 'text-violet-500',
    }

    const directionLabels = {
        LONG: 'Long',
        SHORT: 'Short',
        BOTH: 'Both',
    }

    return <span className={cn('text-sm font-medium', directionStyles[direction])}>{directionLabels[direction]}</span>
}
const formatAllocation = (allocation: number) => {
    return Number.isFinite(allocation) ? Number(allocation).toFixed(2) : '0.00'
}
const columns: TableColumn<InstanceOverview>[] = [
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
        render: (row) => (
            <span className="text-sm font-normal text-neutral-50">
                {row.symbols?.length ? row.symbols.join(', ') : row.tradingPair ?? '—'}
            </span>
        ),
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
        title: 'Allocation',
        key: 'allocation',
        type: 'dynamic',
        render: (row) => (
            <span className="text-sm font-normal text-neutral-50">{formatAllocation(row.allocation)}</span>
        ),
    },
    {
        title: 'Leverage',
        key: 'leverage',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-50">{row.leverage}x</span>,
    },
    {
        title: "Today's PnL",
        key: 'todayPnL',
        type: 'dynamic',
        render: (row) => (
            <span className={cn('text-sm font-normal', row.todayPnL >= 0 ? 'text-green-500' : 'text-red-500')}>
                {row.todayPnL >= 0 ? '+' : ''}${row.todayPnL.toFixed(2)}
            </span>
        ),
    },
    {
        title: 'Last Trade',
        key: 'lastTrade',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-50">{row.lastTrade || '— · —'}</span>,
    },
    {
        title: 'Status',
        key: 'status',
        type: 'dynamic',
        render: (row) => <StatusBadge status={row.status} openPositions={row.openPositions} />,
    },
]

export default function StrategyOverviewTable({ data, isLoading }: StrategyOverviewTableProps) {
    return (
        <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
            <TableHeader title="Strategy Overview" />
            <div className="mt-6">
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 animate-pulse rounded-lg bg-neutral-800/60" />
                        ))}
                    </div>
                ) : (
                    <Table 
                        columns={columns as unknown as TableColumn<Record<string, unknown>>[]} 
                        tableData={data as unknown as Record<string, unknown>[]} 
                    />
                )}
            </div>
        </div>
    )
}
