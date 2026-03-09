import { cn } from '@/lib/utils'
import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from 'react-hook-form'

type BinanceSymbol = {
    symbol: string
    contractType: string
    status: string
    quoteAsset: string
    baseAsset: string
}

type BinanceExchangeInfo = {
    symbols: BinanceSymbol[]
}

type SymbolEntry = {
    symbol: string  // e.g. BTCUSDT
    base: string    // e.g. BTC
}

function useBinanceSymbols() {
    const [symbols, setSymbols] = useState<SymbolEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancelled = false

        // fapi.binance.com is the USD-Margined Futures API — all results are futures symbols
        fetch('https://fapi.binance.com/fapi/v1/exchangeInfo')
            .then((res) => res.json() as Promise<BinanceExchangeInfo>)
            .then((data) => {
                if (cancelled) return
                const filtered: SymbolEntry[] = data.symbols
                    .filter(
                        (s) =>
                            s.contractType === 'PERPETUAL' &&
                            s.status === 'TRADING' &&
                            s.quoteAsset === 'USDT',   // USDT-margined perps only
                    )
                    .map((s) => ({ symbol: s.symbol, base: s.baseAsset }))
                    .sort((a, b) => a.symbol.localeCompare(b.symbol))
                setSymbols(filtered)
            })
            .catch(() => {
                if (!cancelled) setError(true)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => { cancelled = true }
    }, [])

    return { symbols, loading, error }
}

type Props<T extends FieldValues> = {
    label: string
    name: Path<T>
    control: Control<T>
    required?: boolean
    rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'>
}

export default function SymbolSearchSelect<T extends FieldValues>({ label, name, control, required = false, rules }: Props<T>) {
    const { symbols, loading, error } = useBinanceSymbols()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const filtered = query.length === 0
        ? symbols
        : symbols.filter(
            (s) =>
                s.symbol.toLowerCase().includes(query.toLowerCase()) ||
                s.base.toLowerCase().includes(query.toLowerCase()),
        )

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Focus search input when dropdown opens; clear query on close
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50)
        } else {
            setQuery('')
        }
    }, [open])

    return (
        <Controller
            name={name}
            control={control}
            rules={required ? { required: 'Symbol is required', ...rules } : rules}
            render={({ field, fieldState }) => (
                <div ref={containerRef} className="relative flex flex-col gap-2">
                    <label className="font-medium text-neutral-50">
                        {label}
                        {required && <span className="ml-0.5 text-neutral-200">*</span>}
                    </label>

                    {/* Trigger button */}
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className={cn(
                            'flex h-[52px] w-full items-center justify-between rounded-lg border border-transparent bg-white/10 px-4 text-left transition-colors focus:outline-none focus:border-blue-700',
                            fieldState.error && 'border-red-500',
                        )}
                    >
                        <span className={field.value ? 'text-neutral-50' : 'text-neutral-500'}>
                            {loading ? 'Loading futures symbols…' : (field.value || 'Search futures symbol…')}
                        </span>
                        <ChevronDown size={16} className={cn('text-neutral-400 transition-transform', open && 'rotate-180')} />
                    </button>

                    {/* Dropdown */}
                    {open && (
                        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-white/10 bg-neutral-900 shadow-xl">
                            {/* Search input */}
                            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                                <Search size={14} className="shrink-0 text-neutral-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search e.g. BTC, ETH, SOL…"
                                    className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 outline-none"
                                />
                                {loading && (
                                    <span className="shrink-0 text-xs text-neutral-500">Loading…</span>
                                )}
                                {!loading && !error && (
                                    <span className="shrink-0 text-xs text-neutral-600">
                                        {filtered.length} of {symbols.length}
                                    </span>
                                )}
                            </div>

                            {/* Symbol list */}
                            <ul className="max-h-60 overflow-y-auto py-1">
                                {loading && (
                                    <li className="px-3 py-2 text-sm text-neutral-500">Fetching from Binance Futures API…</li>
                                )}
                                {error && !loading && (
                                    <li className="px-3 py-2 text-sm text-red-400">
                                        Could not load symbols. Check your connection.
                                    </li>
                                )}
                                {!loading && !error && filtered.length === 0 && (
                                    <li className="px-3 py-2 text-sm text-neutral-500">No matching futures symbol.</li>
                                )}
                                {filtered.map(({ symbol, base }) => (
                                    <li
                                        key={symbol}
                                        onClick={() => {
                                            field.onChange(symbol)
                                            setOpen(false)
                                        }}
                                        className={cn(
                                            'flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-white/10',
                                            field.value === symbol ? 'bg-blue-700/30 text-blue-300' : 'text-neutral-200',
                                        )}
                                    >
                                        <span className="font-medium">{symbol}</span>
                                        <span className="text-xs text-neutral-500">{base} · USDT Perp</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {fieldState.error && (
                        <p className="text-xs leading-tight text-red-500">{fieldState.error.message}</p>
                    )}
                </div>
            )}
        />
    )
}
