import Table from '@/components/ui/table/table'
import TableHeader from '@/components/ui/table/table-header'
import TablePagination from '@/components/ui/table/table-pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { useState } from 'react'
import { subDays } from 'date-fns'
import { cn } from '@/lib/utils'

type TradeHistory = {
    tradeId: string
    strategyName: string
    tradingPair: string
    direction: 'Long' | 'Short'
    entryPrice: number
    exitPrice: number
    leverage: string
    size: number
    pnl: number
    duration: string
    exitReason: 'Take Profit' | 'Stop Loss'
    closed: string
}

const DirectionBadge = ({ direction }: { direction: TradeHistory['direction'] }) => {
    const styles: Record<TradeHistory['direction'], string> = {
        Long: 'bg-green-500/10 text-green-400',
        Short: 'bg-red-500/10 text-red-400',
    }
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center rounded-[40px] px-4 py-1.5 text-xs font-bold',
                styles[direction],
            )}
        >
            {direction}
        </span>
    )
}

const ExitReasonBadge = ({ reason }: { reason: TradeHistory['exitReason'] }) => {
    const isProfit = reason === 'Take Profit'
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center rounded-[40px] px-4 py-1.5 text-xs font-bold whitespace-nowrap',
                isProfit ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400',
            )}
        >
            {reason}
        </span>
    )
}

const dummyTrades: TradeHistory[] = [
    {
        tradeId: 'TRD-001',
        strategyName: 'Momentum Breakout',
        tradingPair: 'BTC/USDT',
        direction: 'Long',
        entryPrice: 42500.0,
        exitPrice: 43250.0,
        leverage: '5x',
        size: 0.5,
        pnl: 375.0,
        duration: '2h 15m',
        exitReason: 'Take Profit',
        closed: '2 hours ago',
    },
    {
        tradeId: 'TRD-002',
        strategyName: 'Mean Reversion',
        tradingPair: 'ETH/USDT',
        direction: 'Short',
        entryPrice: 2850.5,
        exitPrice: 2820.0,
        leverage: '3x',
        size: 2.0,
        pnl: 182.75,
        duration: '45m',
        exitReason: 'Take Profit',
        closed: '3 hours ago',
    },
    {
        tradeId: 'TRD-003',
        strategyName: 'Grid Trading',
        tradingPair: 'BNB/USDT',
        direction: 'Long',
        entryPrice: 320.0,
        exitPrice: 315.5,
        leverage: '2x',
        size: 5.0,
        pnl: -45.2,
        duration: '1h 30m',
        exitReason: 'Stop Loss',
        closed: '5 hours ago',
    },
    {
        tradeId: 'TRD-004',
        strategyName: 'Scalping Pro',
        tradingPair: 'SOL/USDT',
        direction: 'Long',
        entryPrice: 98.5,
        exitPrice: 101.2,
        leverage: '10x',
        size: 10.0,
        pnl: 270.0,
        duration: '15m',
        exitReason: 'Take Profit',
        closed: '6 hours ago',
    },
    {
        tradeId: 'TRD-005',
        strategyName: 'Swing Strategy',
        tradingPair: 'MATIC/USDT',
        direction: 'Short',
        entryPrice: 0.85,
        exitPrice: 0.88,
        leverage: '2x',
        size: 1000.0,
        pnl: -60.0,
        duration: '4h 20m',
        exitReason: 'Stop Loss',
        closed: '8 hours ago',
    },
    {
        tradeId: 'TRD-006',
        strategyName: 'Arbitrage Hunter',
        tradingPair: 'ADA/USDT',
        direction: 'Long',
        entryPrice: 0.52,
        exitPrice: 0.55,
        leverage: '4x',
        size: 500.0,
        pnl: 120.0,
        duration: '30m',
        exitReason: 'Take Profit',
        closed: '10 hours ago',
    },
    {
        tradeId: 'TRD-007',
        strategyName: 'Momentum Breakout',
        tradingPair: 'BTC/USDT',
        direction: 'Short',
        entryPrice: 43100.0,
        exitPrice: 42800.0,
        leverage: '5x',
        size: 0.3,
        pnl: 150.0,
        duration: '1h 45m',
        exitReason: 'Take Profit',
        closed: '12 hours ago',
    },
    {
        tradeId: 'TRD-008',
        strategyName: 'Scalping Pro',
        tradingPair: 'SOL/USDT',
        direction: 'Long',
        entryPrice: 100.0,
        exitPrice: 99.2,
        leverage: '10x',
        size: 8.0,
        pnl: -64.0,
        duration: '8m',
        exitReason: 'Stop Loss',
        closed: '14 hours ago',
    },
]

const columns: TableColumn<TradeHistory>[] = [
    {
        title: 'Trade ID',
        key: 'tradeId',
        type: 'dynamic',
        render: (row) => (
            <span className="font-mono text-xs font-medium tracking-wide text-neutral-400">{row.tradeId}</span>
        ),
    },
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
        render: (row) => <span className="text-sm font-semibold text-neutral-50">{row.tradingPair}</span>,
    },
    {
        title: 'Direction',
        key: 'direction',
        type: 'dynamic',
        render: (row) => <DirectionBadge direction={row.direction} />,
    },
    {
        title: 'Entry Price',
        key: 'entryPrice',
        type: 'dynamic',
        render: (row) => (
            <span className="text-sm font-normal text-neutral-50">
                ${row.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
    },
    {
        title: 'Exit Price',
        key: 'exitPrice',
        type: 'dynamic',
        render: (row) => (
            <span className="text-sm font-normal text-neutral-50">
                ${row.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
    },
    {
        title: 'Leverage',
        key: 'leverage',
        type: 'dynamic',
        render: (row) => (
            <span className="text-sm font-semibold text-orange-400">{row.leverage}</span>
        ),
    },
    {
        title: 'Size',
        key: 'size',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-50">{row.size}</span>,
    },
    {
        title: 'PnL',
        key: 'pnl',
        type: 'dynamic',
        render: (row) => (
            <span
                className={cn(
                    'text-sm font-semibold',
                    row.pnl >= 0 ? 'text-green-400' : 'text-red-400',
                )}
            >
                {row.pnl >= 0 ? '+' : ''}${Math.abs(row.pnl).toFixed(2)}
            </span>
        ),
    },
    {
        title: 'Duration',
        key: 'duration',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-300">{row.duration}</span>,
    },
    {
        title: 'Exit Reason',
        key: 'exitReason',
        type: 'dynamic',
        render: (row) => <ExitReasonBadge reason={row.exitReason} />,
    },
    {
        title: 'Closed',
        key: 'closed',
        type: 'dynamic',
        render: (row) => <span className="text-sm font-normal text-neutral-400">{row.closed}</span>,
    },
]

export default function HistoryTable() {
    const [result, setResult] = useState<string>('all')
    const [direction, setDirection] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredTrades = dummyTrades.filter((trade) => {
        const resultMatch =
            result === 'all' ||
            (result === 'profit' && trade.pnl >= 0) ||
            (result === 'loss' && trade.pnl < 0)

        const directionMatch =
            direction === 'all' ||
            (direction === 'long' && trade.direction === 'Long') ||
            (direction === 'short' && trade.direction === 'Short')

        return resultMatch && directionMatch
    })

    const totalDocs = filteredTrades.length
    const totalPages = Math.ceil(totalDocs / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentTrades = filteredTrades.slice(startIndex, startIndex + itemsPerPage)

    const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
        setter(value)
        setCurrentPage(1)
    }

    const paginationOptions: TablePagination = {
        page: currentPage,
        limit: itemsPerPage,
        totalPages,
        totalDocs,
        pagingCounter: totalDocs === 0 ? 0 : startIndex + 1,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        onPageChange: (page: number) => setCurrentPage(page),
    }

    return (
        <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <TableHeader title="History">
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={result} onValueChange={handleFilterChange(setResult)}>
                        <SelectTrigger className="h-10 w-37 rounded-xl border border-neutral-700 bg-neutral-800 px-3 text-sm text-neutral-200">
                            <SelectValue placeholder="All Results" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Results</SelectItem>
                            <SelectItem value="profit">Profit</SelectItem>
                            <SelectItem value="loss">Loss</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={direction} onValueChange={handleFilterChange(setDirection)}>
                        <SelectTrigger className="h-10 w-37 rounded-xl border border-neutral-700 bg-neutral-800 px-3 text-sm text-neutral-200">
                            <SelectValue placeholder="All Directions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Directions</SelectItem>
                            <SelectItem value="long">Long</SelectItem>
                            <SelectItem value="short">Short</SelectItem>
                        </SelectContent>
                    </Select>

                    <DateRangePicker
                        initialDateFrom={subDays(new Date(), 7)}
                        initialDateTo={new Date()}
                    />
                </div>
            </TableHeader>

            <div className="mt-4">
                <Table columns={columns} tableData={currentTrades} />
            </div>

            <TablePagination paginationOptions={paginationOptions} tableName="trades" />
        </div>
    )
}
