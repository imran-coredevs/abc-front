'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthYearPickerProps {
    month?: number
    year?: number
    onChange?: (month: number, year: number) => void
}

export function MonthYearPicker({ onChange }: MonthYearPickerProps) {
    const [currentDate, setCurrentDate] = React.useState(new Date())
    const [isOpen, setIsOpen] = React.useState(false)

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const years = Array.from({ length: 20 }, (_, i) => currentDate.getFullYear() - 10 + i)

    const handlePrev = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        setCurrentDate(newDate)
        onChange?.(newDate.getMonth() + 1, newDate.getFullYear()) // 1-indexed month
    }

    const handleNext = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        setCurrentDate(newDate)
        onChange?.(newDate.getMonth() + 1, newDate.getFullYear()) // 1-indexed month
    }

    const handleSelectMonth = (month: number) => {
        const newDate = new Date(currentDate.getFullYear(), month)
        setCurrentDate(newDate)
        setIsOpen(false)
        onChange?.(month + 1, newDate.getFullYear()) // ✅ send 1-indexed month
    }

    const handleSelectYear = (year: number) => {
        const newDate = new Date(year, currentDate.getMonth())
        setCurrentDate(newDate)
        setIsOpen(false)
        onChange?.(currentDate.getMonth() + 1, year) // ✅ send month/year
    }

    return (
        <div className="flex w-[380px] flex-col items-center rounded-lg border-none bg-white p-4">
            {/* Navbar */}
            <div className="mb-2 flex w-full items-center justify-between">
                <button onClick={handlePrev} className="hover:bg-white-300 rounded-full border-none p-2">
                    <ChevronLeft size={24} className="text-neutral-950" />
                </button>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 text-[24px] font-semibold text-neutral-900 hover:underline"
                >
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </button>

                <button onClick={handleNext} className="hover:bg-white-300 rounded-full border-none p-2">
                    <ChevronRight size={24} className="text-neutral-950" />
                </button>
            </div>

            {isOpen && (
                <div className="mt-3 flex w-full items-center justify-between gap-4 border-t border-neutral-200 pt-8">
                    <div>
                        <p className="p-sm mb-3 ml-2 text-neutral-600">Month</p>
                        <div className="grid grid-cols-2 gap-2">
                            {months.map((m, i) => (
                                <button
                                    key={m}
                                    onClick={() => handleSelectMonth(i)}
                                    className={`p-md px-2 py-1 font-medium hover:bg-gray-100 ${i === currentDate.getMonth() ? 'font-medium text-orange-500' : ''}`}
                                >
                                    {m.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="p-sm mb-3 ml-2 text-neutral-600">Year</p>
                        <div className="custom-scrollbar flex h-[200px] flex-col gap-3 overflow-y-auto">
                            {years.map((y) => (
                                <button
                                    key={y}
                                    onClick={() => handleSelectYear(y)}
                                    className={`p-md px-2 py-1 font-medium text-neutral-900 hover:bg-gray-100 ${y === currentDate.getFullYear() ? 'font-medium text-orange-500' : ''}`}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
