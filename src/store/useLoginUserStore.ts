import { create } from 'zustand'

type LoginUserStore = {
    user: User | null
    token: string | null
    refreshToken: string | null
    isLoaded: boolean
    setUser: (user: User | null) => void
    setToken: (token: string | null) => void
    setRefreshToken: (refreshToken: string | null) => void
    clear: () => void
    saveToLocalStorage: (user: User, token: string, refreshToken: string) => void
    saveToSessionStorage: (user: User, token: string, refreshToken: string) => void
    loadFromStorage: () => void
    setLoaded: (loaded: boolean) => void
}

export const useLoginUserStore = create<LoginUserStore>((set) => ({
    user: null,
    token: null,
    refreshToken: null,
    isLoaded: false,
    setUser: (user) => set(() => ({ user })),
    setToken: (token) => set(() => ({ token })),
    setRefreshToken: (refreshToken) => set(() => ({ refreshToken })),
    setLoaded: (loaded) => set(() => ({ isLoaded: loaded })),
    clear: () => {
        localStorage.removeItem('arbitrax-auth-storage-user')
        localStorage.removeItem('arbitrax-auth-storage-token')
        localStorage.removeItem('arbitrax-refresh-token')
        sessionStorage.removeItem('arbitrax-auth-storage-user')
        sessionStorage.removeItem('arbitrax-auth-storage-token')
        sessionStorage.removeItem('arbitrax-refresh-token')
        set(() => ({ user: null, token: null, refreshToken: null, isLoaded: true }))
    },
    saveToLocalStorage: (user, token, refreshToken) => {
        localStorage.setItem('arbitrax-auth-storage-user', JSON.stringify(user))
        localStorage.setItem('arbitrax-auth-storage-token', token)
        localStorage.setItem('arbitrax-refresh-token', refreshToken)
        sessionStorage.removeItem('arbitrax-auth-storage-user')
        sessionStorage.removeItem('arbitrax-auth-storage-token')
        sessionStorage.removeItem('arbitrax-refresh-token')
        set(() => ({ user, token, refreshToken, isLoaded: true }))
    },
    saveToSessionStorage: (user, token, refreshToken) => {
        sessionStorage.setItem('arbitrax-auth-storage-user', JSON.stringify(user))
        sessionStorage.setItem('arbitrax-auth-storage-token', token)
        sessionStorage.setItem('arbitrax-refresh-token', refreshToken)
        localStorage.removeItem('arbitrax-auth-storage-user')
        localStorage.removeItem('arbitrax-auth-storage-token')
        localStorage.removeItem('arbitrax-refresh-token')
        set(() => ({ user, token, refreshToken, isLoaded: true }))
    },
    loadFromStorage: () => {
        let user = null
        let token = null
        let refreshToken = null

        const localUser = localStorage.getItem('arbitrax-auth-storage-user')
        const localToken = localStorage.getItem('arbitrax-auth-storage-token')
        const localRefreshToken = localStorage.getItem('arbitrax-refresh-token')
        if (localUser && localToken) {
            user = JSON.parse(localUser)
            token = localToken
            refreshToken = localRefreshToken
        } else {
            const sessionUser = sessionStorage.getItem('arbitrax-auth-storage-user')
            const sessionToken = sessionStorage.getItem('arbitrax-auth-storage-token')
            const sessionRefreshToken = sessionStorage.getItem('arbitrax-refresh-token')
            if (sessionUser && sessionToken) {
                user = JSON.parse(sessionUser)
                token = sessionToken
                refreshToken = sessionRefreshToken
            }
        }
        set(() => ({ user, token, refreshToken, isLoaded: true }))
    },
}))
