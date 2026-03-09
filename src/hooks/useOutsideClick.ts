import { useEffect, useRef } from 'react'

export function useOutsideClick<T extends HTMLElement>(callback: () => void): React.RefObject<T | null> {
    const ref = useRef<T | null>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [callback])

    return ref
}
