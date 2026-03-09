import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { useLoginUserStore } from '@/store/useLoginUserStore'

export function useAuth() {
    const navigate = useNavigate()
    const { setUser, setToken, saveToLocalStorage, saveToSessionStorage, clear } = useLoginUserStore()

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string; rememberMe?: boolean }) => {
            // Mock login - no API call
            return {
                user: {
                    id: '1',
                    email: email,
                    firstName: 'Admin',
                    lastName: 'User',
                    profileImageUrl: '',
                },
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            }
        },
        onSuccess: async (data, variables) => {
            const user = {
                id: data.user.id,
                email: data.user.email,
                firstName: data.user.firstName || '',
                lastName: data.user.lastName || '',
                profileImage: data.user.profileImageUrl || '',
            }

            setUser(user)
            setToken(data.accessToken)

            // Save tokens based on remember me preference
            if (variables.rememberMe) {
                saveToLocalStorage(user, data.accessToken, data.refreshToken)
            } else {
                saveToSessionStorage(user, data.accessToken, data.refreshToken)
            }

            toast.success('Login successful!')
            navigate('/')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.'
            toast.error(message)
        },
    })

    const logoutMutation = useMutation({
        mutationFn: async () => {
            // Mock logout - no API call
            return Promise.resolve()
        },
        onSuccess: () => {
            clear()
            toast.success('Logged out successfully')
            navigate('/login')
        },
        onError: (error: any) => {
            console.error('Logout error:', error)
            // Clear local state anyway
            clear()
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
