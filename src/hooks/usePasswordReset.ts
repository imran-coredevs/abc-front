import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function usePasswordReset() {
    const forgotPasswordMutation = useMutation({
        mutationFn: async (data: { email: string }) => {
            // Mock forgot password - no API call
            return Promise.resolve()
        },
        onSuccess: () => {
            toast.success('Password reset email sent! Check your inbox.')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to send reset email.'
            toast.error(message)
        },
    })

    const resetPasswordMutation = useMutation({
        mutationFn: async (data: { token: string; newPassword: string }) => {
            // Mock reset password - no API call
            return Promise.resolve()
        },
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
