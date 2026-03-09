import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function usePassword() {
    const updatePasswordMutation = useMutation({
        mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
            // Mock update password - no API call
            return Promise.resolve()
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
