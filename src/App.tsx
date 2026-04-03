import { RouterProvider } from 'react-router'
import Providers from './utils/providers'
import { router } from './routes'
import { useEffect, useRef } from 'react'
import { useLoginUserStore } from './store/useLoginUserStore'
import LoadingSpinner from './components/ui/LoadingSpinner'
import investorService from '@/services/investorService'
import { resolveAssetUrl } from '@/lib/utils'

export default function App() {
    const { loadFromStorage, isLoaded, user, token, setUser, saveToLocalStorage, saveToSessionStorage } = useLoginUserStore()
    const profileSyncRequested = useRef(false)

    useEffect(() => {
        loadFromStorage()
    }, [loadFromStorage])

    useEffect(() => {
        if (!isLoaded || profileSyncRequested.current || !user || !token) {
            return
        }

        profileSyncRequested.current = true

        void (async () => {
            try {
                const profile = await investorService.getProfile()
                const updatedUser = {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    firstName: profile.firstName || user.firstName || '',
                    lastName: profile.lastName || user.lastName || '',
                    avatarUrl: profile.avatarUrl,
                    profileImage: resolveAssetUrl(profile.avatarUrl),
                }

                setUser(updatedUser)

                const storedRefreshToken =
                    localStorage.getItem('cda-trading-bot-refresh-token') ||
                    sessionStorage.getItem('cda-trading-bot-refresh-token') ||
                    ''

                if (localStorage.getItem('cda-trading-bot-auth-storage-token')) {
                    saveToLocalStorage(updatedUser, token, storedRefreshToken)
                } else {
                    saveToSessionStorage(updatedUser, token, storedRefreshToken)
                }
            } catch {
                profileSyncRequested.current = false
            }
        })()
    }, [isLoaded, user, token, setUser, saveToLocalStorage, saveToSessionStorage])

    if (!isLoaded) {
        return <LoadingSpinner />
    }

    return (
        <Providers>
            <RouterProvider router={router} />
        </Providers>
    )
}
