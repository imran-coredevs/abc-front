import { Button } from '@/components/ui/button'

export default function StrategyManagementTop() {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-neutral-50">Strategy Management</h1>
                <p className="text-sm text-neutral-400">
                    Create, manage, and review your trading strategies in one place
                </p>
            </div>

            <div className="flex items-center gap-4">
                <Button>Create Instance</Button>
            </div>
        </div>
    )
}
