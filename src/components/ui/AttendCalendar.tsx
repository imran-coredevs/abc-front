import * as React from 'react'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

function AttendCalendar({
    className = 'border-none',
    classNames,
    showOutsideDays = true,
    captionLayout = 'label',
    buttonVariant = 'secondary',
    formatters,
    components,
    type = '',
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>['variant']
    type?: string
}) {
    const defaultClassNames = getDefaultClassNames()
    const today = new Date()

    return (
        <div className="flex w-full flex-col items-center p-4">
            <DayPicker
                showOutsideDays={showOutsideDays}
                defaultMonth={today} // default month
                className={cn(
                    'group/calendar border-none text-neutral-800 [--cell-size:40px]',
                    type === 'profileDetails' ? 'rounded-t-md border-b-0' : 'rounded-md',
                    className,
                )}
                captionLayout={captionLayout}
                formatters={{
                    formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
                    ...formatters,
                }}
                classNames={{
                    root: cn('w-fit', defaultClassNames.root),
                    months: cn('flex gap-4 flex-col md:flex-row relative px-20', defaultClassNames.months),
                    month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
                    nav: cn(
                        'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
                        defaultClassNames.nav,
                    ),
                    button_previous: cn(
                        buttonVariants({ variant: buttonVariant }),
                        'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none border-none',
                        defaultClassNames.button_previous,
                    ),
                    button_next: cn(
                        buttonVariants({ variant: buttonVariant }),
                        'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none border-none',
                        defaultClassNames.button_next,
                    ),
                    month_caption: cn(
                        'text-[24px] font-semibold text-neutral-900 text-center flex items-center justify-center h-(--cell-size) w-full px-2',
                        defaultClassNames.month_caption,
                    ),
                    weekdays: cn('flex gap-1 my-6', defaultClassNames.weekdays),
                    weekday: cn(
                        'text-center text-[20px] font-semibold text-neutral-900 flex-1 select-none',
                        defaultClassNames.weekday,
                    ),
                    week: cn('flex w-full gap-2', defaultClassNames.week),
                    day: cn('p-lg text-neutral-700 flex-1 aspect-square text-center rounded-md', defaultClassNames.day),
                    // today: cn('bg-orange-500/20', defaultClassNames.today),
                    range_start: cn('bg-orange-500 text-white rounded-l-md', defaultClassNames.range_start),
                    range_middle: cn('bg-orange-500/70 text-white', defaultClassNames.range_middle),
                    range_end: cn('bg-orange-500 text-white rounded-r-md', defaultClassNames.range_end),
                    outside: cn('text-neutral-200 opacity-50', defaultClassNames.outside),
                    disabled: cn('text-neutral-200 opacity-50', defaultClassNames.disabled),
                    hidden: cn('invisible', defaultClassNames.hidden),
                    ...classNames,
                }}
                components={{
                    Root: ({ className, rootRef, ...props }) => (
                        <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
                    ),
                    Chevron: ({ className, orientation, ...props }) => {
                        if (orientation === 'left')
                            return <ChevronLeftIcon className={cn('size-6 text-neutral-950', className)} {...props} />
                        if (orientation === 'right')
                            return <ChevronRightIcon className={cn('size-6 text-neutral-950', className)} {...props} />
                        return <ChevronDownIcon className={cn('size-4', className)} {...props} />
                    },
                    DayButton: AttendCalendarDayButton,
                    WeekNumber: ({ children, ...props }) => (
                        <td {...props}>
                            <div className="flex h-10 w-10 items-center justify-center text-center">{children}</div>
                        </td>
                    ),
                    ...components,
                }}
                {...props}
            />
        </div>
    )
}

function AttendCalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
    const defaultClassNames = getDefaultClassNames()
    const ref = React.useRef<HTMLButtonElement>(null)

    // React.useEffect(() => {
    //   if (modifiers.focused) ref.current?.focus()
    // }, [modifiers.focused])

    const date = day.date ? new Date(day.date) : undefined

    return (
        <Button
            ref={ref}
            variant="secondary"
            size="icon"
            data-day={date?.toLocaleDateString()}
            data-selected-single={
                modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
            }
            data-range-start={modifiers.range_start}
            data-range-end={modifiers.range_end}
            data-range-middle={modifiers.range_middle}
            className={cn(
                'p-lg h-[48px] w-[48px] flex-1 rounded-full border-none bg-white text-center text-neutral-700',
                modifiers.selected && 'bg-orange-500 text-white',
                modifiers.range_start && 'rounded-l-md bg-orange-500 text-white',
                modifiers.range_end && 'rounded-r-md bg-orange-500 text-white',
                modifiers.range_middle && 'bg-orange-500/70 text-white',
                defaultClassNames.day,
                className,
            )}
            {...props}
        />
    )
}

export { AttendCalendar, AttendCalendarDayButton }
