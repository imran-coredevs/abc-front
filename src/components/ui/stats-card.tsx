import Loader from '@/components/ui/loader'
import formatAmount from '@/lib/formatAmount'

const imgLine = 'https://www.figma.com/api/mcp/asset/f1f11500-f783-4d86-9a73-6657b9f42fa5'
const imgShadow = 'https://www.figma.com/api/mcp/asset/8b3b4703-fcc8-40a0-8441-238a60d6fb9f'
const imgIncrease = 'https://www.figma.com/api/mcp/asset/1ddd1c09-5428-4c96-aad0-6dd9a622acd7'

type CardVariant = 'progress' | 'increase' | 'simple'

interface CardProps {
    title: string
    description: string
    quantity: number | string
    icon: React.ReactNode
    variant?: CardVariant
    progressPercent?: number
    increaseText?: string
    isAmount?: boolean
    isLoading?: boolean
    amountIcon?: React.ReactNode
}

export const StatsCard: React.FC<CardProps> = ({
    title,
    description,
    quantity,
    icon,
    variant = 'simple',
    progressPercent,
    increaseText,
    isAmount = false,
    isLoading = false,
    amountIcon,
}) => {
    const formattedQuantity = isAmount ? formatAmount(quantity) : quantity
    const isSimple = variant === 'simple'
    const hasProgress = variant === 'progress'
    const hasIncrease = variant === 'increase'
    const quantitySize = isSimple ? 'text-[28px] leading-9 tracking-[-0.56px]' : 'text-xl leading-7'

    return (
        <div className="relative flex w-full flex-col gap-6 overflow-clip rounded-xl bg-white/5 p-5">
            {/* Top gradient line */}
                <div className="absolute top-px left-1/2 h-0 w-[230px] -translate-x-1/2">
                    <div className="absolute inset-[-1px_0_0_0]">
                        <img alt="" className="block size-full max-w-none" src={imgLine} />
                    </div>
                </div>

            {/* Icon & Heading */}
            <div className="flex items-start gap-4">
                <div className="relative flex size-11 shrink-0 items-center justify-center overflow-clip rounded-lg bg-white/8 p-2.5">
                    {/* Icon shadow */}
                    <div className="pointer-events-none absolute bottom-[-20px] left-1/2 size-[50px] -translate-x-1/2">
                        <div className="absolute inset-[-40%]">
                            <img alt="" className="block size-full max-w-none" src={imgShadow} />
                        </div>
                    </div>
                    {icon}
                </div>
                <div className="flex shrink-0 flex-col gap-1 whitespace-nowrap">
                    <p className="text-xl leading-7 font-bold text-[#f5f5f5]">{title}</p>
                    <p className="text-sm leading-[18px] font-normal text-[#b5b8bf]">{description}</p>
                </div>
            </div>

            {/* Amount/Number Display */}
            {isLoading ? (
                <Loader className="size-8" />
            ) : hasProgress ? (
                <div className="flex w-full items-start gap-3">
                    {amountIcon}
                    <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2">
                        <p className={`font-semibold whitespace-nowrap text-[#fafafa] ${quantitySize}`}>
                            {formattedQuantity}
                        </p>
                        <div className="flex w-full items-center gap-1">
                            <div className="relative h-2 min-w-0 flex-1 overflow-clip rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-[#7962f1]"
                                    style={{ width: `${progressPercent || 0}%` }}
                                />
                            </div>
                            <p className="shrink-0 text-sm leading-[19px] font-normal whitespace-nowrap text-[#7962f1]">
                                {progressPercent}%
                            </p>
                        </div>
                    </div>
                </div>
            ) : hasIncrease ? (
                <div className="flex items-start gap-3">
                    {amountIcon}
                    <div className="flex shrink-0 flex-col items-start justify-center gap-2">
                        <p className={`font-semibold whitespace-nowrap text-[#fafafa] ${quantitySize}`}>
                            {formattedQuantity}
                        </p>
                        <div className="flex items-center gap-1">
                            <div className="relative size-4 shrink-0 overflow-clip">
                                <div className="absolute inset-[16.6%_8.2%]">
                                    <img alt="" className="absolute block size-full max-w-none" src={imgIncrease} />
                                </div>
                            </div>
                            <p className="text-sm leading-4.75 font-normal whitespace-nowrap text-[#e5e5e5]">
                                {increaseText}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex w-full items-center gap-3">
                    <p className={`font-semibold whitespace-nowrap text-[#fafafa] ${quantitySize}`}>
                        {formattedQuantity}
                    </p>
                </div>
            )}
        </div>
    )
}
