import { useLoginUserStore } from '@/store'
import { Navigate, Outlet } from 'react-router'
import { useAuthExpired } from '@/hooks/useAuthExpired'

const ProtectedRoute = () => {
    const { user: isAuthenticated } = useLoginUserStore()
    useAuthExpired()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
