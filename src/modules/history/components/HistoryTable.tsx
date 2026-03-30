import Table from '@/components/ui/table/table'
import TableHeader from '@/components/ui/table/table-header'
import TablePagination from '@/components/ui/table/table-pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { useState, useEffect } from 'react'
import { subDays, format } from 'date-fns'
import { cn } from '@/lib/utils'
import { instanceService, type TradeHistoryItem } from '@/services/instanceService'
import toast from 'react-hot-toast'
import { DateRange } from 'react-day-picker'

type TradeHistory = {
    tradeId: string
    strategyName: string
    tradingPair: string
    direction: 'LONG' | 'SHORT'
    entryPrice: number
    exitPrice: number
    leverage: number
    size: number
    pnl: number
    pnlPercentage: number
    duration: string
    exitReason: string
    closed: string
}

const DirectionBadge = ({ direction }: { direction: TradeHistory['direction'] }) => {
    const styles: Record<TradeHistory['direction'], string> = {
        LONG: 'bg-green-500/10 text-green-400',
        SHORT: 'bg-red-500/10 text-red-400',
    }
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center rounded-[40px] px-4 py-1.5 text-xs font-bold',
                styles[direction],
            )}
        >
            {direction === 'LONG' ? 'Long' : 'Short'}
        </span>
    )
}

const ExitReasonBadge = ({ reason, pnl }: { reason: string; pnl: number }) => {
    const isProfit = pnl >= 0
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
                ${row.entryPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
    },
    {
        title: 'Exit Price',
        key: 'exitPrice',
        type: 'dynamic',
        render: (row) => (
            <span className="text-sm font-normal text-neutral-50">
                ${row.exitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
    },
    {
        title: 'Leverage',
        key: 'leverage',
        type: 'dynamic',
        render: (row) => (
            <span className="text-sm font-semibold text-orange-400">{row.leverage}x</span>
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
        render: (row) => <ExitReasonBadge reason={row.exitReason} pnl={row.pnl} />,
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
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    })
    const [trades, setTrades] = useState<TradeHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })

    const itemsPerPage = 10

    // Fetch trade history
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            try {
                const filters: any = {
                    page: currentPage,
                    limit: itemsPerPage,
                    result,
                    direction,
                }

                if (dateRange?.from) {
                    filters.dateFrom = format(dateRange.from, 'yyyy-MM-dd')
                }
                if (dateRange?.to) {
                    filters.dateTo = format(dateRange.to, 'yyyy-MM-dd')
                }

                const response = await instanceService.getTradeHistory(filters)
                
                // Map API response to component format
                const formattedTrades: TradeHistory[] = response?.data?.map((trade) => ({
                    tradeId: trade?.tradeId ?? '',
                    strategyName: trade?.strategyName ?? '',
                    tradingPair: trade?.tradingPair ?? '',
                    direction: trade?.direction ?? 'LONG',
                    entryPrice: trade?.entryPrice ?? 0,
                    exitPrice: trade?.exitPrice ?? 0,
                    leverage: trade?.leverage ?? 1,
                    size: trade?.size ?? 0,
                    pnl: trade?.pnl ?? 0,
                    pnlPercentage: trade?.pnlPercentage ?? 0,
                    duration: trade?.duration ?? '',
                    exitReason: trade?.exitReason ?? '',
                    closed: trade?.closed ?? '',
                })) ?? []

                setTrades(formattedTrades)
                setPagination(response?.meta?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 })
            } catch (error: any) {
                console.error('Failed to fetch trade history:', error)
                toast.error(error?.response?.data?.message || 'Failed to load trade history')
                setTrades([])
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [currentPage, result, direction, dateRange])

    const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
        setter(value)
        setCurrentPage(1)
    }

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range)
        setCurrentPage(1)
    }

    const paginationOptions: TablePagination = {
        page: currentPage,
        limit: itemsPerPage,
        totalPages: pagination.totalPages,
        totalDocs: pagination.total,
        pagingCounter: pagination.total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
        hasNextPage: currentPage < pagination.totalPages,
        hasPrevPage: currentPage > 1,
        onPageChange: (page: number) => setCurrentPage(page),
    }

    return (
        <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
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
                        initialDateFrom={dateRange?.from} 
                        initialDateTo={dateRange?.to}
                        onUpdate={(values) => handleDateRangeChange(values.range)}
                    />
                </div>
            </TableHeader>

            <div className="relative overflow-hidden mt-5">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-blue-500" />
                    </div>
                ) : (
                    <Table columns={columns} tableData={trades} />
                )}
                <div className="absolute -bottom-[20%] left-[50%] z-1 -translate-x-1/2 pointer-events-none">
                    <div className="h-200 w-200 rounded-full bg-linear-to-b from-blue-900 to-blue-800 blur-[500px]" />
                </div>
            </div>

            {!loading && trades.length > 0 && <TablePagination paginationOptions={paginationOptions} tableName="trades" />}
        </div>
    )
}
