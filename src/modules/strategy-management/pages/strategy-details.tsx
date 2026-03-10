import { useStrategyStore } from '@/store/useStrategyStore'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import BacktestingTab from '../components/BacktestingTab'
import StrategyDetailsTab from '../components/StrategyDetailsTab'
import StrategyDetailsTop from '../components/StrategyDetailsTop'
import StrategyTabs from '../components/StrategyTabs'

export default function StrategyDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'details' | 'backtesting'>('details')

    const getById = useStrategyStore((s) => s.getById)
    const strategy = id ? getById(id) : undefined

    if (!strategy) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                <p className="text-lg">Strategy not found.</p>
                <button
                    onClick={() => navigate('/strategy-management')}
                    className="mt-4 text-blue-400 underline hover:text-blue-300"
                >
                    Back to strategies
                </button>
            </div>
        )
    }

    const strategyData = {
        ...strategy.formData,
        status: strategy.status,
    }

    return (
        <div>
            <StrategyDetailsTop />

            <div className='bg-white/5 rounded-xl p-5 mt-8'>
                <StrategyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-6">
                    {activeTab === 'details' ? <StrategyDetailsTab strategyData={strategyData} /> : <BacktestingTab />}
                </div>
            </div>
        </div>
    )
}
