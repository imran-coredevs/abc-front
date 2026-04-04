import envConfig from '@/config/envConfig'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useLoginUserStore } from '@/store/useLoginUserStore'

// Base API configuration
export const api = axios.create({
    baseURL: envConfig.API_BASE_URL,
    timeout: 60000, // 60 seconds for long-running operations
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: any) => void
    reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        // Try to get token from localStorage first, then sessionStorage
        let token = localStorage.getItem('cda-trading-bot-auth-storage-token')
        if (!token) {
            token = sessionStorage.getItem('cda-trading-bot-auth-storage-token')
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Response interceptor - Handle 401 errors and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`
                        }
                        return api(originalRequest)
                    })
                    .catch((err) => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            // Try to get refresh token
            let refreshToken = localStorage.getItem('cda-trading-bot-refresh-token')
            if (!refreshToken) {
                refreshToken = sessionStorage.getItem('cda-trading-bot-refresh-token')
            }

            if (!refreshToken || refreshToken === '') {
                // No refresh token, logout
                isRefreshing = false
                clearAuthData()
                return Promise.reject(error)
            }

            try {
                // Attempt to refresh the token
                const response = await axios.post(
                    `${envConfig.API_BASE_URL}/auth/refresh`,
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json' } },
                )

                const refreshPayload = response.data?.data || response.data
                const nextAccessToken = refreshPayload?.token || refreshPayload?.accessToken
                const nextRefreshToken = refreshPayload?.refreshToken

                if (!nextAccessToken) {
                    throw new Error('Refresh endpoint did not return an access token')
                }

                // Update stored token
                const isLocalStorage = !!localStorage.getItem('cda-trading-bot-auth-storage-token')
                if (isLocalStorage) {
                    localStorage.setItem('cda-trading-bot-auth-storage-token', nextAccessToken)
                    if (nextRefreshToken) {
                        localStorage.setItem('cda-trading-bot-refresh-token', nextRefreshToken)
                    }
                } else {
                    sessionStorage.setItem('cda-trading-bot-auth-storage-token', nextAccessToken)
                    if (nextRefreshToken) {
                        sessionStorage.setItem('cda-trading-bot-refresh-token', nextRefreshToken)
                    }
                }

                const store = useLoginUserStore.getState()
                store.setToken(nextAccessToken)
                if (nextRefreshToken) {
                    store.setRefreshToken(nextRefreshToken)
                }

                // Update the failed request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
                }

                processQueue(null, nextAccessToken)
                isRefreshing = false

                // Retry the original request
                return api(originalRequest)
            } catch (refreshError) {
                // Refresh failed, logout user
                processQueue(refreshError, null)
                isRefreshing = false
                clearAuthData()
                return Promise.reject(refreshError)
            }
        }

        // For other errors, just reject
        return Promise.reject(error)
    },
)

// Helper function to clear auth data and redirect to login
function clearAuthData() {
    // Clear auth state from Zustand store
    const store = useLoginUserStore.getState()
    store.clear()

    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('auth-expired'))
}
