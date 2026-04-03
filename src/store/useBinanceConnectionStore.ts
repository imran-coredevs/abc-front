import { create } from 'zustand'
import { getBinanceCredentials } from '@/services/investorService'

type BinanceConnectionStore = {
    isConnected: boolean | null
    isLoading: boolean
    setConnectionStatus: (status: boolean) => void
    clearConnectionStatus: () => void
    fetchConnectionStatus: () => Promise<boolean>
}

export const useBinanceConnectionStore = create<BinanceConnectionStore>((set) => ({
    isConnected: null,
    isLoading: false,
    setConnectionStatus: (status) => set(() => ({ isConnected: status })),
    clearConnectionStatus: () => set(() => ({ isConnected: null, isLoading: false })),
    fetchConnectionStatus: async () => {
        set(() => ({ isLoading: true }))
        try {
            const response = await getBinanceCredentials()
            const hasCredentials = !!response?.hasCredentials
            set(() => ({ isConnected: hasCredentials, isLoading: false }))
            return hasCredentials
        } catch {
            set(() => ({ isConnected: false, isLoading: false }))
            return false
        }
    },
}))
