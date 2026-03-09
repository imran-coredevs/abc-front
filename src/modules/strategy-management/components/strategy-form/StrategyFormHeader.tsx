import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'iconsax-reactjs'
import { useNavigate } from 'react-router'

type Props = {
    isEditMode: boolean
    id?: string
}

export default function StrategyFormHeader({ isEditMode, id }: Props) {
    const navigate = useNavigate()

    const backPath = isEditMode ? `/strategy-management/${id}` : '/strategy-management'

    return (
        <div className="flex flex-row gap-4">
            <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(backPath)}
                className="size-10 w-max rounded-xl border border-neutral-700 bg-transparent px-3 hover:bg-neutral-700"
            >
                <ArrowLeft size={24} />
            </Button>

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-neutral-50">
                    {isEditMode ? 'Edit Strategy' : 'Create Strategy'}
                </h1>
                <p className="text-sm text-neutral-400">
                    {isEditMode
                        ? 'Update your strategy’s trading rules, risk management, and capital allocation'
                        : 'Define how your strategy trades, manages risk, and allocates capital'}
                </p>
            </div>
        </div>
    )
}
