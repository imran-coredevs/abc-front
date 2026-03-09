import { RouterProvider } from 'react-router'
import Providers from './utils/providers'
import { router } from './routes'
import { useEffect } from 'react'
import { useLoginUserStore } from './store/useLoginUserStore'
import LoadingSpinner from './components/ui/LoadingSpinner'

export default function App() {
    const { loadFromStorage, isLoaded } = useLoginUserStore()

    useEffect(() => {
        loadFromStorage()
    }, [loadFromStorage])

    if (!isLoaded) {
        return <LoadingSpinner />
    }

    return (
        <Providers>
            <RouterProvider router={router} />
        </Providers>
    )
}
