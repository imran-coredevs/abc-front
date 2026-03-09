export default function HistoryTop() {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-neutral-50">Trade History</h1>
                <p className="text-sm text-neutral-400">
                    Review all executed trades, their outcomes, and execution details across your strategies
                </p>
            </div>
        </div>
    )
}
