import { cn } from '@/lib/utils'
import { endOfMonth as endOfMonthFn, startOfMonth as startOfMonthFn, subDays } from 'date-fns'
import { ArrowDown2, ArrowLeft2, ArrowRight2, Calendar } from 'iconsax-reactjs'
import { type FC, useEffect, useState } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type Preset = 'last7days' | 'thisMonth' | 'lastMonth' | 'custom'

export interface DateRangePickerProps {
    onUpdate?: (values: { range: DateRange; preset?: Preset }) => void
    align?: 'start' | 'center' | 'end'
    locale?: string
    initialDateFrom?: Date
    initialDateTo?: Date
    triggerClassName?: string
}

export interface DateRange {
    from: Date | undefined
    to: Date | undefined
}

const formatDate = (date: Date, locale: string = 'en-us'): string =>
    date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const isSameDateRange = (range1: DateRange, range2: DateRange) => {
    if (!range1.from || !range1.to || !range2.from || !range2.to) return false
    return sameDay(range1.from, range2.from) && sameDay(range1.to, range2.to)
}

/* ------------------------------
   Calendar Component
------------------------------ */
const CalendarDetails: FC<{
    selected?: DateRange
    onSelect?: (v: DateRange) => void
    baseMonth: Date
    setBaseMonth: (d: Date) => void
    locale?: string
    rangeEnabled?: boolean
}> = ({ selected, onSelect, baseMonth, setBaseMonth, locale = 'en-US', rangeEnabled = false }) => {
    const selFrom = selected?.from
    const selTo = selected?.to

    const handleDateClick = (d: Date) => {
        if (!rangeEnabled) {
            onSelect?.({ from: d, to: d })
        } else {
            if (!selFrom || (selFrom && selTo)) {
                onSelect?.({ from: d, to: undefined })
            } else if (selFrom && !selTo) {
                if (d < selFrom) {
                    onSelect?.({ from: d, to: selFrom })
                } else {
                    onSelect?.({ from: selFrom, to: d })
                }
            }
        }
    }

    const year = baseMonth.getFullYear()
    const month = baseMonth.getMonth()
    const firstWeekday = new Date(year, month, 1).getDay()
    const totalDays = daysInMonth(year, month)
    const daysArray: (Date | null)[] = Array(firstWeekday).fill(null)
    for (let i = 1; i <= totalDays; i++) daysArray.push(new Date(year, month, i))
    while (daysArray.length % 7 !== 0) daysArray.push(null)

    return (
        <div className="h-full w-full rounded-xl bg-neutral-800">
            {/* Month Navigation */}
            <div className="mb-2 flex items-center justify-between">
                <button
                    onClick={() => setBaseMonth(addMonths(baseMonth, -1))}
                    className="rounded-full p-2 transition hover:bg-neutral-700"
                >
                    <ArrowLeft2 size={20} className="text-neutral-300" />
                </button>
                <h4 className="flex-1 text-center font-semibold text-neutral-50">
                    {baseMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
                </h4>
                <button
                    onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
                    className="rounded-full p-2 transition hover:bg-neutral-700"
                >
                    <ArrowRight2 size={20} className="text-neutral-300" />
                </button>
            </div>

            {/* Weekdays */}
            <div className="mt-4 mb-2 grid grid-cols-7 gap-2 text-center text-sm font-semibold text-neutral-400">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
                {daysArray.map((d, i) => {
                    if (!d) return <div key={i} className="h-8" />
                    const isFromDate = selFrom && sameDay(d, selFrom)
                    const isToDate = selTo && sameDay(d, selTo)
                    const inRange = selFrom && selTo && d > selFrom && d < selTo
                    return (
                        <button
                            key={i}
                            onClick={() => handleDateClick(d)}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all',
                                (isFromDate || isToDate) && 'bg-blue-700 text-white',
                                inRange && 'bg-blue-700/20 text-neutral-50',
                                !isFromDate && !isToDate && !inRange && 'text-neutral-300 hover:bg-neutral-700',
                            )}
                        >
                            {d.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

/* ------------------------------
   Main DateRangePicker
------------------------------ */
export const DateRangePicker: FC<DateRangePickerProps> = ({
    onUpdate,
    align = 'center',
    locale = 'en-US',
    initialDateFrom,
    initialDateTo,
    triggerClassName,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [range, setRange] = useState<DateRange>({
        from: initialDateFrom,
        to: initialDateTo,
    })
    const [baseMonth, setBaseMonth] = useState(startOfMonth(initialDateFrom || new Date()))
    const [selectedPreset, setSelectedPreset] = useState<Preset | undefined>(() => {
        if (initialDateFrom && initialDateTo) {
            const now = new Date()
            const last7DaysRange = { from: subDays(now, 6), to: now }
            if (isSameDateRange({ from: initialDateFrom, to: initialDateTo }, last7DaysRange)) {
                return 'last7days'
            }
            // Add checks for other presets if necessary
            return 'custom'
        }
        return undefined
    })

    useEffect(() => {
        setRange({ from: initialDateFrom, to: initialDateTo })

        if (initialDateFrom && initialDateTo) {
            const now = new Date()
            const last7DaysRange = { from: subDays(now, 6), to: now }
            if (isSameDateRange({ from: initialDateFrom, to: initialDateTo }, last7DaysRange)) {
                setSelectedPreset('last7days')
            } else {
                setSelectedPreset('custom')
            }
        } else {
            setSelectedPreset(undefined)
        }
    }, [initialDateFrom, initialDateTo])

    const handlePreset = (type: Preset) => {
        const now = new Date()
        setSelectedPreset(type)

        if (type === 'custom') {
            setRange({ from: undefined, to: undefined })
            onUpdate?.({ range: { from: undefined, to: undefined }, preset: 'custom' })
            setBaseMonth(startOfMonth(now))
            return
        }

        let newRange: DateRange

        switch (type) {
            case 'last7days':
                newRange = { from: subDays(now, 6), to: now }
                break
            case 'thisMonth':
                newRange = { from: startOfMonthFn(now), to: endOfMonthFn(now) }
                break
            case 'lastMonth': {
                const lastMonthStart = startOfMonthFn(subDays(now, now.getDate()))
                newRange = { from: lastMonthStart, to: endOfMonthFn(lastMonthStart) }
                break
            }
        }

        setRange(newRange)
        onUpdate?.({ range: newRange, preset: type })
        setBaseMonth(startOfMonth(newRange.from || now))
    }

    const handleClear = () => {
        const cleared = { from: undefined, to: undefined }
        setRange(cleared)
        setSelectedPreset('custom')
        onUpdate?.({ range: cleared, preset: 'custom' })
    }

    const displayRangeText = () => {
        if (selectedPreset !== 'custom' && selectedPreset !== undefined) {
            return {
                last7days: 'Last 7 days',
                thisMonth: 'This Month',
                lastMonth: 'Last Month',
            }[selectedPreset]
        }

        if (range.from && range.to) {
            if (sameDay(range.from, range.to)) return formatDate(range.from, locale)
            return `${formatDate(range.from, locale)} – ${formatDate(range.to, locale)}`
        }
        if (range.from) {
            return `${formatDate(range.from, locale)} – Select Date`
        }
        return 'Select Date'
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    className={cn(
                        'h-10 rounded-xl border border-neutral-700 bg-neutral-800 px-3 text-sm text-neutral-200',
                        triggerClassName,
                    )}
                >
                    <div className="flex w-full items-center gap-2">
                        <Calendar size={20} className="shrink-0 text-neutral-300" />
                        <p className="truncate text-sm text-neutral-200">{displayRangeText()}</p>
                        <ArrowDown2 variant="Bold" size={20} className="shrink-0 text-neutral-300" />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align={align}
                className="w-full max-w-[95vw] overflow-y-auto max-h-[80vh] rounded-xl border-neutral-700 bg-neutral-800 p-4 shadow-md sm:max-w-md lg:max-w-lg"
            >
                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* Calendar - First on mobile/tablet, side by side on desktop */}
                    <div className="w-full lg:order-2 lg:flex-1">
                        <CalendarDetails
                            selected={range}
                            onSelect={(val) => {
                                setRange(val)
                                setSelectedPreset('custom')
                                onUpdate?.({ range: val, preset: 'custom' })
                            }}
                            rangeEnabled={true}
                            baseMonth={baseMonth}
                            setBaseMonth={setBaseMonth}
                            locale={locale}
                        />
                    </div>

                    {/* Presets - Below calendar on mobile/tablet, left side on desktop */}
                    <div className="flex w-full flex-col gap-2 lg:order-1 lg:w-auto lg:min-w-[140px] lg:border-r lg:border-neutral-700 lg:pr-4">
                        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                            {(['last7days', 'thisMonth'] as const).map((preset) => (
                                <Button
                                    key={preset}
                                    onClick={() => handlePreset(preset)}
                                    variant="secondary"
                                    className={cn(
                                        'rounded-full border-neutral-50/10 px-4 py-2 text-sm font-normal',
                                        selectedPreset === preset && 'border border-blue-700 font-medium',
                                    )}
                                >
                                    {preset === 'last7days' ? 'Last 7 days' : 'This Month'}
                                </Button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                            {(['lastMonth', 'custom'] as const).map((preset) => (
                                <Button
                                    key={preset}
                                    onClick={() => handlePreset(preset)}
                                    variant="secondary"
                                    className={cn(
                                        'rounded-full border-neutral-50/10 px-4 py-2 text-sm font-normal',
                                        selectedPreset === preset && 'border border-blue-700 font-medium',
                                    )}
                                >
                                    {preset === 'lastMonth' ? 'Last Month' : 'Custom'}
                                </Button>
                            ))}
                        </div>
                        <div className="mt-2">
                            <Button
                                onClick={handleClear}
                                variant="secondary"
                                className="w-full rounded-full border-neutral-50/10 px-4 py-2 text-sm font-medium"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
