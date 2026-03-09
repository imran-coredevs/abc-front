import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

type Props = { children: React.ReactNode }

const queryClient = new QueryClient()

export default function Providers({ children }: Props) {
    return (
        <>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            <Toaster position="top-right" />
        </>
    )
}
