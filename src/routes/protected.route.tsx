import { useLoginUserStore } from '@/store'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {
    const { user: isAuthenticated } = useLoginUserStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
