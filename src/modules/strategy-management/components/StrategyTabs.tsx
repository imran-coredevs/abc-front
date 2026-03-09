import React from 'react'

const StrategyTabs = ({
    activeTab,
    setActiveTab,
}: {
    activeTab: 'details' | 'backtesting'
    setActiveTab: React.Dispatch<React.SetStateAction<'details' | 'backtesting'>>
}) => {
    return (
        <div className="flex justify-between gap-5 rounded-full bg-white/5 px-4 py-3">
            <button
                onClick={() => setActiveTab('details')}
                className={`w-[45%] font-medium text-neutral-50 transition-colors ${
                    activeTab === 'details'
                        ? 'rounded-full bg-linear-to-b from-blue-900 to-blue-700 py-3'
                        : 'cursor-pointer border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
            >
                Details
            </button>
            <button
                onClick={() => setActiveTab('backtesting')}
                className={`w-[45%] font-medium text-neutral-50 transition-colors ${
                    activeTab === 'backtesting'
                        ? 'cursor-pointer rounded-full bg-linear-to-b from-blue-900 to-blue-700 py-3'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
            >
                Backtesting Entirely
            </button>
        </div>
    )
}

export default StrategyTabs
