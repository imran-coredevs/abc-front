import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService } from '@/services/authService'

export function usePasswordReset() {
    const forgotPasswordMutation = useMutation({
        mutationFn: ({ email }: { email: string }) => authService.forgotPassword(email),
        onSuccess: () => {
            toast.success('If that email is registered, a reset link has been sent.')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to send reset email.'
            toast.error(message)
        },
    })

    const resetPasswordMutation = useMutation({
        mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
            authService.resetPassword(token, newPassword),
        onSuccess: () => {
            toast.success('Password reset successful! You can now login.')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to reset password.'
            toast.error(message)
        },
    })

    return {
        forgotPassword: forgotPasswordMutation.mutate,
        resetPassword: resetPasswordMutation.mutate,
        isSendingEmail: forgotPasswordMutation.isPending,
        isResettingPassword: resetPasswordMutation.isPending,
        forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
        resetPasswordSuccess: resetPasswordMutation.isSuccess,
    }
}
