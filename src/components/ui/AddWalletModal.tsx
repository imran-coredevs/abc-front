import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Wallet } from 'ethers'

interface AddWalletModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddWallet: (data: WalletFormData) => void
    existingWallet?: WalletFormData | null
    mode?: 'add' | 'replace'
}

interface WalletFormData {
    privateKey: string
    publicKey: string
}

const PRIVATE_KEY_REGEX = /^(0x)?[0-9a-fA-F]{64}$/

const WALLET_FORM_DEFAULTS: WalletFormData = {
    privateKey: '',
    publicKey: '',
}

const derivePublicKeyFromPrivateKey = (privateKey: string): string => {
    if (!privateKey || !PRIVATE_KEY_REGEX.test(privateKey)) {
        return ''
    }

    try {
        // Add 0x prefix if not present
        const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`
        
        // Create wallet from private key using ethers.js
        const wallet = new Wallet(formattedKey)
        
        // Return the wallet address (public key)
        return wallet.address
    } catch (error) {
        console.error('Failed to derive public key:', error)
        return ''
    }
}

const useWalletForm = (mode: 'add' | 'replace') => {
    const [showExistingWallet, setShowExistingWallet] = useState(true)

    const form = useForm<WalletFormData>({
        mode: 'onChange',
        defaultValues: WALLET_FORM_DEFAULTS,
    })

    const { control, handleSubmit, reset, watch, setValue, formState } = form
    const privateKey = watch('privateKey')
    const publicKey = watch('publicKey')

    useEffect(() => {
        if (mode === 'replace') {
            setShowExistingWallet(true)
        }
    }, [mode])

    useEffect(() => {
        const derivedPublicKey = derivePublicKeyFromPrivateKey(privateKey)
        setValue('publicKey', derivedPublicKey)
    }, [privateKey, setValue])

    const resetForm = useCallback(() => {
        reset(WALLET_FORM_DEFAULTS)
        setShowExistingWallet(true)
    }, [reset])

    return {
        control,
        handleSubmit,
        resetForm,
        privateKey,
        publicKey,
        showExistingWallet,
        isValid: formState.isValid,
        isSubmitting: formState.isSubmitting,
    }
}

const useModalContent = (mode: 'add' | 'replace') => {
    return useMemo(() => {
        const isReplaceMode = mode === 'replace'
        return {
            title: isReplaceMode ? 'Replace Wallet' : 'Add Wallet',
            description: isReplaceMode
                ? 'View your current wallet or remove it to add a new one'
                : 'Add a wallet to sign arbitrage transactions. Enter your private key to generate the corresponding public key.',
            submitButtonText: isReplaceMode ? 'Replace Wallet' : 'Add Wallet',
        }
    }, [mode])
}

export const AddWalletModal = ({
    open,
    onOpenChange,
    onAddWallet,
    existingWallet,
    mode = 'add',
}: AddWalletModalProps) => {
    const { control, handleSubmit, resetForm, publicKey, showExistingWallet, isValid, isSubmitting } = useWalletForm(
        mode
    )
    const { title, description, submitButtonText } = useModalContent(mode)

    const onSubmit = useCallback(
        async (data: WalletFormData) => {
            try {
                await onAddWallet(data)
                resetForm()
                onOpenChange(false)
            } catch (error) {
                console.error('Failed to add wallet:', error)
            }
        },
        [onAddWallet, resetForm, onOpenChange]
    )

    const handleCancel = useCallback(() => {
        resetForm()
        onOpenChange(false)
    }, [resetForm, onOpenChange])

    const isReplaceMode = mode === 'replace'
    const showExisting = isReplaceMode && existingWallet && showExistingWallet

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:!max-w-3xl rounded-lg border border-neutral-700 bg-neutral-950 p-10">
                <DialogHeader>
                    <DialogTitle className="-mt-4 text-[25px] leading-8 font-semibold text-neutral-100">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-neutral-300">{description}</DialogDescription>
                </DialogHeader>

                <Separator className="my-4" />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {showExisting && existingWallet ? (
                        <div className="flex flex-col gap-2">
                            <label className="p-md flex items-center gap-1 font-medium text-neutral-50">
                                Current Public Key
                            </label>
                            <input
                                type="text"
                                value={existingWallet?.publicKey || ''}
                                disabled
                                readOnly
                                className="h-[52px] w-full rounded-lg border border-transparent bg-neutral-800 px-4 text-neutral-200 outline-none"
                            />
                        </div>
                    ) : null}

                    <InputField
                        name="privateKey"
                        control={control}
                        type="password"
                        label="Private Key"
                        placeholder="Enter your private key (64 hex characters)"
                        rules={{
                            required: 'Private Key is required',
                            pattern: {
                                value: PRIVATE_KEY_REGEX,
                                message: 'Invalid private key format. Must be 64 hexadecimal characters.',
                            },
                        }}
                    />

                    {publicKey && (
                        <InputField
                            name="publicKey"
                            control={control}
                            type="text"
                            label="Public Key"
                            placeholder="Public key will appear here"
                            disabled
                            rules={{
                                required: 'Public Key could not be generated',
                            }}
                        />
                    )}

                    <Separator className="my-8" />

                    <div className="flex flex-col lg:flex-row items-center gap-2">
                        <Button
                            type="submit"
                            variant="default"
                            className="w-full sm:w-auto"
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : submitButtonText}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCancel}
                            className="w-full sm:w-auto"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
