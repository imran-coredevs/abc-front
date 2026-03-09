import { useState } from 'react'
import toast from 'react-hot-toast'

export function useCopyToClipboard() {
    const [isCopied, setIsCopied] = useState(false)

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setIsCopied(true)

            toast.success(`copied to clipboard`)

            // Reset the copied state after a delay
            setTimeout(() => setIsCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy text to clipboard:', error)
            setIsCopied(false)
        }
    }

    return { isCopied, copyToClipboard }
}
