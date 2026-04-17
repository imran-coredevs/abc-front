type Props = { status: 'pending' | 'running' }

export default function BacktestLoadingState({ status }: Props) {
    return (
        <div className="flex items-center justify-center rounded-lg bg-white/5 p-6">
            <div className="flex flex-col items-center justify-center gap-3">
                <div className="relative size-20">
                    <div className="absolute inset-2.5 animate-spin rounded-full border-[3px] border-transparent border-t-blue-700 border-r-blue-700" />
                    <div className="animation-duration-[800ms] absolute inset-5 animate-spin rounded-full border-[3px] border-transparent border-t-blue-500 border-r-blue-500" />
                </div>
                <p className="max-w-155 text-center text-lg leading-6 font-medium text-neutral-50">
                    {status === 'pending' ? (
                        'Submitting backtest request...'
                    ) : (
                        <>
                            Running historical simulation using live execution logic
                            <br />
                            Please wait while results are calculated.
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}
