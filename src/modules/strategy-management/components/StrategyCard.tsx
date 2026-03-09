import imgBinanceLogo from '@/assets/icon/imgBinanceLogo.svg'
import imgShadow from '@/assets/icon/imgShadow.svg'
import { cn } from '@/lib/utils'
import { ArrowRight, Copy, PlayCircle, StopCircle } from 'iconsax-reactjs'
import toast from 'react-hot-toast'

type StrategyCardProps = {
    apiKey: string
    strategyName: string
    status: 'Running' | 'Stopped'
    pair: string
    direction: 'Long' | 'Short' | 'Both'
    allocation: number
    onToggleStatus: () => void
    onViewDetails: () => void
}

// Status badge component matching Figma TokenPairs design
const StatusBadge = ({ status }: { status: 'Running' | 'Stopped' }) => {
    const statusStyles = {
        Running: 'bg-green-600/10 text-green-500',
        Stopped: 'bg-red-600/10 text-red-500',
    }

    return (
        <div
            className={cn(
                'flex items-center justify-center rounded-[40px] bg-neutral-950 px-5 py-2 text-xs leading-4 font-medium',
                statusStyles[status],
            )}
        >
            {status}
        </div>
    )
}

export default function StrategyCard({
    apiKey,
    strategyName,
    status,
    pair,
    direction,
    allocation,
    onToggleStatus,
    onViewDetails,
}: StrategyCardProps) {
    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(apiKey)
        toast.success('API Key copied to clipboard!')
    }

    const truncateApiKey = (key: string) => {
        if (key.length <= 20) return key
        return `${key.substring(0, 15)}...${key.substring(key.length - 4)}`
    }

    const getDirectionColor = (dir: string) => {
        const colors = {
            Long: 'text-green-500',
            Short: 'text-red-500',
            Both: 'text-violet-500',
        }
        return colors[dir as keyof typeof colors] || 'text-neutral-50'
    }

    return (
        <div className="gradient-border relative flex h-full flex-col gap-8 overflow-hidden rounded-xl bg-white/5 p-6">
            {/* Shadow image at bottom center */}
            <div className="absolute top-30 left-1/2 size-full -translate-x-1/2">
                <img src={imgShadow} alt="" className="object-clip size-full" />
            </div>

            {/* Details section */}
            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-1">
                        <img src={imgBinanceLogo} alt="Binance" className="size-5 shrink-0 rounded-full" />
                        <div className="flex items-center gap-2">
                            <p className="text-sm leading-4.5 font-normal text-neutral-400">{truncateApiKey(apiKey)}</p>
                            <button
                                onClick={handleCopyApiKey}
                                className="shrink-0 text-neutral-400 transition-colors hover:text-green-500"
                            >
                                <Copy variant="Bold" size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Name and Status */}
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl leading-7 font-bold text-neutral-50">{strategyName}</h3>
                        <StatusBadge status={status} />
                    </div>
                </div>

                {/* Pair and Direction */}
                <div className="flex items-center gap-4 text-sm leading-4.5">
                    <div className="flex items-center gap-2">
                        <span className="font-normal text-neutral-200">Pair:</span>
                        <span className="font-medium text-neutral-50">{pair}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-normal text-neutral-200">Direction:</span>
                        <span className={cn('font-medium', getDirectionColor(direction))}>{direction}</span>
                    </div>
                </div>

                {/* Allocation */}
                <div className="flex flex-col gap-1">
                    <p className="text-sm leading-4.5 font-normal text-neutral-200">Allocation</p>
                    <p className="text-2xl leading-8 font-bold tracking-[-0.48px] text-neutral-50">
                        USDT {allocation.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="relative z-10 flex gap-3">
                <button
                    onClick={onToggleStatus}
                    className="flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-[40px] border border-white/30 px-6 py-3 text-base leading-5.25 font-normal text-neutral-50 transition-colors hover:bg-white/5"
                >
                    {status === 'Running' ? (
                        <StopCircle size={20} className="text-red-500" variant="Bold" />
                    ) : (
                        <PlayCircle size={20} className="text-green-500" variant="Bold" />
                    )}
                    {status === 'Running' ? 'Stop' : 'Run'}
                </button>
                <button
                    onClick={onViewDetails}
                    className="flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-[40px] border border-white/30 px-6 py-3 text-base leading-5.25 font-normal text-neutral-50 transition-colors hover:bg-white/5"
                >
                    Details
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    )
}
