import { api } from '@/config/apiConfig'

type ApiEnvelope<T> = {
    data: T
    status: string
    meta?: {
        timestamp?: string
        requestId?: string
    }
}

export interface LoginResponse {
    token: string
    refreshToken: string
    investor: {
        id: string
        email: string
        name: string
    }
}

export interface RefreshResponse {
    token: string
    refreshToken: string
}

export interface RegisterResponse {
    message: string
    email: string
    linkExpiresAt: string
}

export interface MeResponse {
    investorId: string
    email: string
    name: string
}

export const authService = {
    login: (email: string, password: string) =>
        api.post<ApiEnvelope<LoginResponse>>('/auth/login', { email, password }).then((r) => r.data.data),

    refresh: (refreshToken: string) =>
        api.post<ApiEnvelope<RefreshResponse>>('/auth/refresh', { refreshToken }).then((r) => r.data.data),

    logout: () => api.post<ApiEnvelope<{ message: string }>>('/auth/logout').then((r) => r.data.data),

    forgotPassword: (email: string) =>
        api
            .post<ApiEnvelope<{ message: string }>>('/auth/forgot-password', { email })
            .then((r) => r.data.data),

    resetPassword: (token: string, newPassword: string) =>
        api
            .post<ApiEnvelope<{ message: string }>>('/auth/reset-password', { token, newPassword })
            .then((r) => r.data.data),

    changePassword: (oldPassword: string, newPassword: string) =>
        api
            .post<ApiEnvelope<{ message: string }>>('/auth/change-password', { oldPassword, newPassword })
            .then((r) => r.data.data),

    register: (email: string) =>
        api.post<ApiEnvelope<RegisterResponse>>('/auth/register', { email }).then((r) => r.data.data),

    getMe: () => api.get<ApiEnvelope<MeResponse>>('/auth/me').then((r) => r.data.data),
}
