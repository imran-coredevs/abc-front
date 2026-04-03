import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { useLoginUserStore } from '@/store/useLoginUserStore'
import { authService } from '@/services/authService'
import { useBinanceConnectionStore } from '@/store/useBinanceConnectionStore'

function parseName(fullName: string | null | undefined): { firstName: string; lastName: string } {
    if (!fullName) return { firstName: 'Investor', lastName: '' }
    const parts = fullName.trim().split(' ')
    return {
        firstName: parts[0] || fullName,
        lastName: parts.slice(1).join(' ') || '',
    }
}

export function useAuth() {
    const navigate = useNavigate()
    const { setUser, setToken, saveToLocalStorage, saveToSessionStorage, clear } = useLoginUserStore()
    const { fetchConnectionStatus, clearConnectionStatus } = useBinanceConnectionStore()

    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string; rememberMe?: boolean }) =>
            authService.login(email, password),
        onSuccess: async (data, variables) => {
            const { firstName, lastName } = parseName(data?.investor?.name)
            const user = {
                id: data?.investor?.id ?? '',
                name: data?.investor?.name ?? '',
                email: data?.investor?.email ?? '',
                firstName,
                lastName,
                avatarUrl: '',
            }

            setUser(user)
            setToken(data?.token ?? '')

            if (variables.rememberMe) {
                saveToLocalStorage(user, data?.token ?? '', data?.refreshToken ?? '')
            } else {
                saveToSessionStorage(user, data?.token ?? '', data?.refreshToken ?? '')
            }

            await fetchConnectionStatus()

            toast.success('Login successful!')
            navigate('/')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.'
            toast.error(message)
        },
    })

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            clear()
            clearConnectionStatus()
            toast.success('Logged out successfully')
            navigate('/login')
        },
        onError: () => {
            // Clear local state regardless of server error
            clear()
            clearConnectionStatus()
            navigate('/login')
        },
    })

    return {
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
    }
}
