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
        localStorage.removeItem('cda-trading-bot-auth-storage-user')
        localStorage.removeItem('cda-trading-bot-auth-storage-token')
        localStorage.removeItem('cda-trading-bot-refresh-token')
        sessionStorage.removeItem('cda-trading-bot-auth-storage-user')
        sessionStorage.removeItem('cda-trading-bot-auth-storage-token')
        sessionStorage.removeItem('cda-trading-bot-refresh-token')
        set(() => ({ user: null, token: null, refreshToken: null, isLoaded: true }))
    },
    saveToLocalStorage: (user, token, refreshToken) => {
        localStorage.setItem('cda-trading-bot-auth-storage-user', JSON.stringify(user))
        localStorage.setItem('cda-trading-bot-auth-storage-token', token)
        if (refreshToken) {
            localStorage.setItem('cda-trading-bot-refresh-token', refreshToken)
        } else {
            localStorage.removeItem('cda-trading-bot-refresh-token')
        }
        sessionStorage.removeItem('cda-trading-bot-auth-storage-user')
        sessionStorage.removeItem('cda-trading-bot-auth-storage-token')
        sessionStorage.removeItem('cda-trading-bot-refresh-token')
        set(() => ({ user, token, refreshToken, isLoaded: true }))
    },
    saveToSessionStorage: (user, token, refreshToken) => {
        sessionStorage.setItem('cda-trading-bot-auth-storage-user', JSON.stringify(user))
        sessionStorage.setItem('cda-trading-bot-auth-storage-token', token)
        if (refreshToken) {
            sessionStorage.setItem('cda-trading-bot-refresh-token', refreshToken)
        } else {
            sessionStorage.removeItem('cda-trading-bot-refresh-token')
        }
        localStorage.removeItem('cda-trading-bot-auth-storage-user')
        localStorage.removeItem('cda-trading-bot-auth-storage-token')
        localStorage.removeItem('cda-trading-bot-refresh-token')
        set(() => ({ user, token, refreshToken, isLoaded: true }))
    },
    loadFromStorage: () => {
        let user = null
        let token = null
        let refreshToken = null

        const localUser = localStorage.getItem('cda-trading-bot-auth-storage-user')
        const localToken = localStorage.getItem('cda-trading-bot-auth-storage-token')
        const localRefreshToken = localStorage.getItem('cda-trading-bot-refresh-token')
        if (localUser && localToken) {
            user = JSON.parse(localUser)
            token = localToken
            refreshToken = localRefreshToken
        } else {
            const sessionUser = sessionStorage.getItem('cda-trading-bot-auth-storage-user')
            const sessionToken = sessionStorage.getItem('cda-trading-bot-auth-storage-token')
            const sessionRefreshToken = sessionStorage.getItem('cda-trading-bot-refresh-token')
            if (sessionUser && sessionToken) {
                user = JSON.parse(sessionUser)
                token = sessionToken
                refreshToken = sessionRefreshToken
            }
        }
        set(() => ({ user, token, refreshToken, isLoaded: true }))
    },
}))
