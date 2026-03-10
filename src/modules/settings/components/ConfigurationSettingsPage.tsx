import EmptyState from '@/assets/images/emptyState.svg?react'
import type { BinanceApiFormData } from '@/components/ui/AddBinanceApiKeyModal'
import AddBinanceApiKeyModal from '@/components/ui/AddBinanceApiKeyModal'
import { Button } from '@/components/ui/button'
import { Add, Copy, Trash } from 'iconsax-reactjs'
import { useState } from 'react'
import toast from 'react-hot-toast'

type StoredApiKey = {
    apiKey: string
    secretKey: string
    addedAt: Date
}

function truncateKey(key: string): string {
    if (key.length <= 16) return key
    return `${key.slice(0, 8)}••••••••${key.slice(-4)}`
}

export default function ConfigurationSettingsPage() {
    const [storedKey, setStoredKey] = useState<StoredApiKey | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'add' | 'replace'>('add')

    const handleSave = (data: BinanceApiFormData) => {
        setStoredKey({ ...data, addedAt: new Date() })
        toast.success(modalMode === 'replace' ? 'API key replaced successfully' : 'API key added successfully')
    }

    const handleCopy = () => {
        if (!storedKey) return
        navigator.clipboard.writeText(storedKey.apiKey)
        toast.success('API key copied to clipboard')
    }

    const handleRemove = () => {
        setStoredKey(null)
        toast.success('API key removed')
    }

    const openAdd = () => {
        setModalMode('add')
        setModalOpen(true)
    }

    const openReplace = () => {
        setModalMode('replace')
        setModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="inline-flex flex-col items-start justify-start gap-2">
                <div className="inline-flex items-center justify-start gap-3 self-stretch">
                    <div className="justify-start text-2xl leading-8 font-semibold text-neutral-50">
                        Exchange Connections
                    </div>
                </div>
                <div className="justify-start text-base leading-5 font-normal text-neutral-400">
                    Connect your Binance account to enable live trading and strategy execution
                </div>
            </div>

            {/* Section Header */}
            {/* <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-neutral-50">Binance API Keys</h2>
                    <p className="text-sm text-neutral-400">
                        Add and manage your Binance API keys securely. Your keys are encrypted and never shared.
                    </p>
                </div>
            </div> */}

            {storedKey ? (
                /* ── Connected State ── */
                <div className="flex justify-between space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-neutral-50">Binance API Keys</h2>
                            <p className="text-sm text-neutral-400">
                                Add and manage your Binance API keys securely. Your keys are encrypted and never shared.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <div className="flex h-[52px] flex-1 items-center rounded-full border border-white/10 bg-white/5 px-4">
                                    <span className="font-mono text-sm tracking-wider text-neutral-200">
                                        {truncateKey(storedKey.apiKey)}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleCopy}
                                        className="ml-2 bg-transparent p-2 hover:bg-white/10"
                                    >
                                        <Copy size={18} variant="Bold" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <Button type="button" onClick={openReplace} variant="default" className="flex-1 lg:w-32">
                                Replace
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleRemove}
                                className="border-red-500/30 bg-transparent text-red-500 hover:bg-red-500/10"
                            >
                                <Trash size={16} className="mr-2 inline" />
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                /* ── Empty State ── */
                <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-neutral-50">Binance API Keys</h2>
                            <p className="text-sm text-neutral-400">
                                Add and manage your Binance API keys securely. Your keys are encrypted and never shared.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-6 p-12 text-center">
                        <EmptyState />

                        <div className="space-y-2">
                            <p className="text-base font-semibold text-neutral-200">No Binance API Key Connected</p>
                            <p className="mx-auto text-sm text-neutral-500">
                                Add your Binance API key to start live trading with your strategies
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full justify-center">
                        <Button variant="default" onClick={openAdd}>
                            <Add className="mr-2 mb-1 inline" />
                            Add API Key
                        </Button>
                    </div>
                </div>
            )}

            <AddBinanceApiKeyModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSave={handleSave}
                existingApiKey={storedKey?.apiKey}
                mode={modalMode}
            />
        </div>
    )
}
