import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Separator from '@/components/ui/Separator'
import { Eye, EyeSlash } from 'iconsax-reactjs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export type BinanceApiFormData = {
    apiKey: string
    secretKey: string
}

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (data: BinanceApiFormData) => void | Promise<void>
    existingApiKey?: string | null
    mode?: 'add' | 'replace'
    isSubmitting?: boolean
}

function truncateKey(key: string): string {
    if (key.length <= 16) return key
    return `${key.slice(0, 8)}••••••••${key.slice(-4)}`
}

function PasswordInput({
    label,
    placeholder,
    error,
    ...register
}: {
    label: string
    placeholder: string
    error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
    const [show, setShow] = useState(false)

    return (
        <div className="flex flex-col gap-1.5">
            <label className="font-medium text-neutral-50">{label}</label>
            <div className="flex h-[52px] items-center overflow-hidden rounded-lg border border-transparent bg-white/10 transition-colors focus-within:border-blue-700">
                <input
                    {...register}
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="h-full flex-1 bg-transparent px-4 text-sm text-neutral-200 outline-none placeholder:text-neutral-500"
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow((s) => !s)}
                    className="flex h-full items-center px-3 text-neutral-400 hover:text-neutral-200"
                >
                    {show ? <Eye size={18} /> : <EyeSlash size={18} />}
                </button>
            </div>
            {error && <p className="text-xs leading-tight text-red-500">{error}</p>}
        </div>
    )
}

export default function AddBinanceApiKeyModal({ open, onOpenChange, onSave, existingApiKey, mode = 'add', isSubmitting: externalSubmitting }: Props) {
    const isReplace = mode === 'replace'

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<BinanceApiFormData>({
        mode: 'onChange',
        defaultValues: { apiKey: '', secretKey: '' },
    })

    const handleClose = () => {
        reset()
        onOpenChange(false)
    }

    const onSubmit = async (data: BinanceApiFormData) => {
        await onSave(data)
        reset()
        onOpenChange(false)
    }

    const submitting = isSubmitting || externalSubmitting

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-full rounded-2xl border border-white/10 bg-neutral-950 p-10 shadow-2xl lg:max-w-2xl!">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-neutral-50">
                        {isReplace ? 'Replace Binance API Key' : 'Add Binance API Key'}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-neutral-400">
                        Enter your Binance API credentials. Make sure trading permissions are enabled.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Show existing key in replace mode */}
                    {isReplace && existingApiKey && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-neutral-400">Present API Key</label>
                            <div className="flex h-[52px] items-center rounded-lg border border-white/10 bg-white/5 px-4">
                                <span className="flex-1 font-mono text-sm tracking-wider text-neutral-300">
                                    {truncateKey(existingApiKey)}
                                </span>
                            </div>
                        </div>
                    )}

                    <PasswordInput
                        label="API Key"
                        placeholder="Paste your Binance API key"
                        error={errors.apiKey?.message}
                        {...register('apiKey', {
                            required: 'API Key is required',
                            minLength: { value: 10, message: 'API Key is too short' },
                        })}
                    />

                    <PasswordInput
                        label="Secret Key"
                        placeholder="Paste your Binance secret key"
                        error={errors.secretKey?.message}
                        {...register('secretKey', {
                            required: 'Secret Key is required',
                            minLength: { value: 10, message: 'Secret Key is too short' },
                        })}
                    />

                    <Separator />

                    <div className="flex gap-3">
                        <Button type="submit" variant="default" disabled={!isValid || submitting} className="flex-1">
                            {submitting ? 'Saving...' : isReplace ? 'Replace API Key' : 'Save API Key'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={submitting}
                            className="flex-1 border-neutral-700"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
