import { useLoginUserStore } from '@/store/useLoginUserStore'
import investorService from '@/services/investorService'
import { resolveAssetUrl } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

type ProfileUpdateInput = {
    firstName: string
    lastName: string
    avatar?: File | null
    avatarUrl?: string | null
}

const getDisplayNameParts = (profile: { firstName?: string; lastName?: string; name?: string }) => {
    if (profile.firstName || profile.lastName) {
        return {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
        }
    }

    const fullName = profile.name?.trim() || ''
    if (!fullName) {
        return { firstName: '', lastName: '' }
    }

    const [firstName, ...rest] = fullName.split(/\s+/)
    return {
        firstName: firstName || '',
        lastName: rest.join(' '),
    }
}

export function useProfile() {
    const { user, setUser, saveToLocalStorage, saveToSessionStorage } = useLoginUserStore()

    const persistUser = (updatedUser: User) => {
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
    }

    const updateProfileMutation = useMutation({
        mutationFn: async (data: ProfileUpdateInput) => {
            const payload: Parameters<typeof investorService.updateProfile>[0] = {
                name: `${data.firstName} ${data.lastName}`.trim(),
                firstName: data.firstName,
                lastName: data.lastName,
            }

            if (data.avatarUrl !== undefined) payload.avatarUrl = data.avatarUrl ?? ''
            if (data.avatar) payload.avatar = data.avatar

            const response = await investorService.updateProfile(payload)

            return response
        },
        onSuccess: (data) => {
            const { firstName, lastName } = getDisplayNameParts(data)
            const updatedUser = {
                id: data.id,
                name: data.name || user?.name || `${firstName || user?.firstName || ''} ${lastName || user?.lastName || ''}`.trim(),
                email: data.email,
                firstName: firstName || user?.firstName || '',
                lastName: lastName || user?.lastName || '',
                avatarUrl: data.avatarUrl ?? user?.avatarUrl ?? '',
                profileImage: resolveAssetUrl(data.avatarUrl ?? user?.profileImage ?? ''),
            }

            persistUser(updatedUser)

            toast.success('Profile updated successfully!')
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update profile'
            toast.error(message)
        },
    })

    return {
        updateProfile: updateProfileMutation.mutate,
        isUpdating: updateProfileMutation.isPending,
    }
}
