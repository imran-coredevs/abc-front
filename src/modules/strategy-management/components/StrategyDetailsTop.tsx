import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'iconsax-reactjs'
import { useNavigate } from 'react-router'

export default function StrategyDetailsTop() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-row gap-4">
            <Button
                variant="secondary"
                onClick={() => navigate('/strategy-management')}
                className="border border-neutral-700 size-10 w-max rounded-xl bg-transparent px-3 hover:bg-neutral-700"
            >
                <ArrowLeft size={24} />
            </Button>

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-neutral-50">Strategy Details</h1>
                <p className="text-sm text-neutral-400">Review how this strategy trades, manages risk, and performs</p>
            </div>
        </div>
    )
}
