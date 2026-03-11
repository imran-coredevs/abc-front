import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authService } from '@/services/authService'

export function usePassword() {
    const updatePasswordMutation = useMutation({
        mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
            return authService.changePassword(currentPassword, newPassword)
        },
        onSuccess: () => {
            toast.success('Password updated successfully!')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to update password'
            toast.error(message)
        },
    })

    return {
        updatePassword: updatePasswordMutation.mutate,
        isUpdating: updatePasswordMutation.isPending,
        isSuccess: updatePasswordMutation.isSuccess,
    }
}
