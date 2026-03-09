import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/Separator'
import { formatPublicKey } from '@/lib/formatPublicKey'
import { Add, Copy } from 'iconsax-reactjs'

interface Wallet {
    publicKey: string
    privateKey: string
}

interface WalletSectionProps {
    wallet: Wallet | null
    onOpenModal: () => void
    onCopyPublicKey: () => void
}

export const WalletSection = ({ wallet, onOpenModal, onCopyPublicKey }: WalletSectionProps) => (
    <>
        <div className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-[12.5rem]">
            <div className="flex max-w-full lg:max-w-[42.5rem] flex-1 flex-col gap-2">
                <p className="text-base sm:text-lg font-medium text-neutral-50">Wallet Settings</p>
                <p className="text-sm sm:text-md font-medium text-neutral-400">
                    Add or manage the wallet used to sign arbitrage transactions. Only your public key will be visible;
                    your private key remains secured.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full lg:w-auto lg:min-w-[200px] items-stretch sm:items-center justify-end gap-3">
                {wallet && (
                    <div className="relative flex-1 sm:flex-initial">
                        <input
                            type="text"
                            value={formatPublicKey(wallet.publicKey)}
                            disabled
                            className="h-[50px] w-full sm:w-[10rem] rounded-lg border border-transparent bg-neutral-800 px-4 pr-10 text-sm text-neutral-200 outline-none"
                            readOnly
                        />
                        <Copy
                            className="absolute top-1/2 right-3 size-5 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-200"
                            onClick={onCopyPublicKey}
                        />
                    </div>
                )}
                <Button
                    type="button"
                    variant={wallet ? 'secondary' : 'default'}
                    className="px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto"
                    onClick={onOpenModal}
                >
                    {wallet ? 'Replace Wallet' : 'Add Wallet'} {!wallet && <Add className="size-5" />}
                </Button>
            </div>
        </div>

        <Separator className="my-4 bg-neutral-700" />
    </>
)
