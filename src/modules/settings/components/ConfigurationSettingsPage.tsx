import { AddWalletModal } from '@/components/ui/AddWalletModal'
import { useConfigurationSettings } from './configuration'
import SettingsWrapper from './wrapper'

export default function ConfigurationSettingsPage() {
    const {
        wallet,
        isWalletModalOpen,
        walletMode,
        handleAddWallet,
        handleCopyPublicKey,
        openWalletModal,
        closeWalletModal,
    } = useConfigurationSettings()

    return (
        <SettingsWrapper title="Wallet Configuration" subTitle="Add or update your trading wallet">
            <div className="flex flex-col items-center rounded-xl bg-neutral-900 p-6">
                {/* Wallet Section */}
                <div className="w-full space-y-4">
                    {wallet ? (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-neutral-400">Wallet Address</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={wallet.publicKey}
                                        readOnly
                                        className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-neutral-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCopyPublicKey}
                                        className="rounded-lg bg-orange-500 px-4 py-3 text-sm font-medium text-white hover:bg-orange-600"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={openWalletModal}
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm font-medium text-neutral-50 hover:bg-neutral-700"
                            >
                                Update Wallet
                            </button>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 p-8">
                                <p className="text-sm text-neutral-400 mb-4">No wallet configured</p>
                                <button
                                    type="button"
                                    onClick={openWalletModal}
                                    className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600"
                                >
                                    Add Wallet
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddWalletModal
                open={isWalletModalOpen}
                onOpenChange={closeWalletModal}
                onAddWallet={handleAddWallet}
                existingWallet={wallet}
                mode={walletMode}
            />
        </SettingsWrapper>
    )
}
