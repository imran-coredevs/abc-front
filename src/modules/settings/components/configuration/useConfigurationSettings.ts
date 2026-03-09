import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ConfigurationFormData, CONFIGURATION_DEFAULTS, Wallet } from './constants'

export const useConfigurationSettings = () => {
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const [savedConfig, setSavedConfig] = useState<ConfigurationFormData>(CONFIGURATION_DEFAULTS)
    const [wallet, setWallet] = useState<Wallet | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<ConfigurationFormData>({
        defaultValues: CONFIGURATION_DEFAULTS,
    })

    const handleSave = useCallback(
        async (data: ConfigurationFormData) => {
            setIsSaving(true)
            // Mock save - no API call
            await new Promise(resolve => setTimeout(resolve, 500))
            setSavedConfig(data)
            setIsSaving(false)
            toast.success('Configuration saved successfully!')
        },
        []
    )

    const handleResetToDefault = useCallback(async () => {
        setIsSaving(true)
        // Mock reset - no API call
        await new Promise(resolve => setTimeout(resolve, 500))
        form.reset(CONFIGURATION_DEFAULTS)
        setSavedConfig(CONFIGURATION_DEFAULTS)
        setIsSaving(false)
        toast.success('Configuration reset to defaults!')
    }, [form])

    const handleAddWallet = useCallback(
        async (data: Wallet) => {
            setIsSaving(true)
            // Mock wallet save - no API call
            await new Promise(resolve => setTimeout(resolve, 500))
            setWallet(data)
            setIsWalletModalOpen(false)
            setIsSaving(false)
            toast.success(wallet ? 'Wallet updated successfully!' : 'Wallet added successfully!')
        },
        [wallet]
    )

    const handleCopyPublicKey = useCallback(() => {
        if (wallet) {
            navigator.clipboard.writeText(wallet.publicKey)
            toast.success('Wallet address copied to clipboard!')
        }
    }, [wallet])

    const openWalletModal = useCallback(() => setIsWalletModalOpen(true), [])
    const closeWalletModal = useCallback(() => setIsWalletModalOpen(false), [])

    const walletMode = useMemo<'add' | 'replace'>(() => (wallet ? 'replace' : 'add'), [wallet])

    return {
        form,
        wallet,
        isWalletModalOpen,
        walletMode,
        savedConfig,
        handleSave,
        handleResetToDefault,
        handleAddWallet,
        handleCopyPublicKey,
        openWalletModal,
        closeWalletModal,
        isCreatingWallet: isSaving,
        isUpdatingWallet: isSaving,
        isSavingConfig: isSaving,
    }
}
