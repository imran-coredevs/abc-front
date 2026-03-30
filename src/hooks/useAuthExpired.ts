import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'

export function useAuthExpired() {
    const navigate = useNavigate()

    useEffect(() => {
        const handleAuthExpired = () => {
            toast.error('Session expired. Please login again.')
            navigate('/login', { replace: true })
        }

        window.addEventListener('auth-expired', handleAuthExpired)

        return () => {
            window.removeEventListener('auth-expired', handleAuthExpired)
        }
    }, [navigate])
}
