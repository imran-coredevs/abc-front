import { useLoginUserStore } from '@/store'
import { useBinanceConnectionStore } from '@/store/useBinanceConnectionStore'
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthExpired } from '@/hooks/useAuthExpired'

const ProtectedRoute = () => {
    const { user: isAuthenticated } = useLoginUserStore()
    const { isConnected, fetchConnectionStatus } = useBinanceConnectionStore()
    useAuthExpired()

    useEffect(() => {
        if (isAuthenticated && isConnected === null) {
            void fetchConnectionStatus()
        }
    }, [isAuthenticated, isConnected, fetchConnectionStatus])

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
