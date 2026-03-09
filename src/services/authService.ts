import { api } from '@/config/apiConfig'

export interface LoginResponse {
    token: string
    refreshToken?: string
    investor: {
        id: string
        email: string
        name: string
    }
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
        api.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),

    logout: () => api.post('/auth/logout').then((r) => r.data),

    forgotPassword: (email: string) =>
        api.post('/auth/forgot-password', { email }).then((r) => r.data),

    resetPassword: (token: string, newPassword: string) =>
        api.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),

    changePassword: (oldPassword: string, newPassword: string) =>
        api.post('/auth/change-password', { oldPassword, newPassword }).then((r) => r.data),

    register: (email: string) =>
        api.post<RegisterResponse>('/auth/register', { email }).then((r) => r.data),

    getMe: () => api.get<MeResponse>('/auth/me').then((r) => r.data),
}
