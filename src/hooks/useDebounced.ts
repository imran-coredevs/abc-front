import { useEffect, useState } from 'react'

/**
 * Debounce a changing value.
 * @param value The value to debounce
 * @param delay Time in milliseconds to wait before updating
 */
export function useDebounced<T>(value: T, delay = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return debouncedValue
}
