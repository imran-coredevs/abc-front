import { useLoginUserStore } from '@/store/useLoginUserStore'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function useProfile() {
    const { user, setUser, saveToLocalStorage, saveToSessionStorage } = useLoginUserStore()

    const updateProfileMutation = useMutation({
        mutationFn: async (data: { firstName: string; lastName: string }) => {
            // Mock update profile - no API call
            return Promise.resolve({
                id: user?.id || '1',
                email: user?.email || '',
                firstName: data.firstName,
                lastName: data.lastName,
                profileImageUrl: user?.profileImage || '',
            })
        },
        onSuccess: (data) => {
            const updatedUser = {
                id: data.id,
                email: data.email,
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                profileImage: data.profileImageUrl || user?.profileImage || '',
            }

            setUser(updatedUser)

            // Update storage with fresh data
            const token =
                localStorage.getItem('cda-trading-bot-auth-storage-token') ||
                sessionStorage.getItem('cda-trading-bot-auth-storage-token') ||
                ''

            const storedRefreshToken =
                localStorage.getItem('cda-trading-bot-refresh-token') ||
                sessionStorage.getItem('cda-trading-bot-refresh-token') ||
                ''

            if (localStorage.getItem('cda-trading-bot-auth-storage-token')) {
                saveToLocalStorage(updatedUser, token, storedRefreshToken)
            } else {
                saveToSessionStorage(updatedUser, token, storedRefreshToken)
            }

            toast.success('Profile updated successfully!')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to update profile'
            toast.error(message)
        },
    })

    const updateImageMutation = useMutation({
        mutationFn: async (file: File) => {
            // Mock update image - no API call
            return Promise.resolve({
                id: user?.id || '1',
                email: user?.email || '',
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                profileImageUrl: URL.createObjectURL(file),
            })
        },
        onSuccess: (data) => {
            const updatedUser = {
                id: data.id,
                email: data.email,
                firstName: data.firstName || user?.firstName || '',
                lastName: data.lastName || user?.lastName || '',
                profileImage: data.profileImageUrl || '',
            }

            setUser(updatedUser)

            // Update storage with fresh data
            const token =
                localStorage.getItem('cda-trading-bot-auth-storage-token') ||
                sessionStorage.getItem('cda-trading-bot-auth-storage-token') ||
                ''

            const storedRefreshToken =
                localStorage.getItem('cda-trading-bot-refresh-token') ||
                sessionStorage.getItem('cda-trading-bot-refresh-token') ||
                ''

            if (localStorage.getItem('cda-trading-bot-auth-storage-token')) {
                saveToLocalStorage(updatedUser, token, storedRefreshToken)
            } else {
                saveToSessionStorage(updatedUser, token, storedRefreshToken)
            }

            toast.success('Profile image updated successfully!')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to update profile image'
            toast.error(message)
        },
    })

    return {
        updateProfile: updateProfileMutation.mutate,
        isUpdating: updateProfileMutation.isPending,
        updateImage: updateImageMutation.mutate,
        isUploadingImage: updateImageMutation.isPending,
    }
}
