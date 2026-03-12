import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { instanceService } from '@/services/instanceService'
import toast from 'react-hot-toast'
import BacktestingTab from '../components/BacktestingTab'
import StrategyDetailsTab from '../components/StrategyDetailsTab'
import StrategyDetailsTop from '../components/StrategyDetailsTop'
import StrategyTabs from '../components/StrategyTabs'

export default function StrategyDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'details' | 'backtesting'>('details')
    const [strategy, setStrategy] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStrategy = async () => {
            if (!id) return

            try {
                setIsLoading(true)
                const response = await instanceService.getInstance(id)
                setStrategy(response.data)
            } catch (error) {
                console.error('Failed to fetch strategy:', error)
                toast.error('Failed to load strategy details')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStrategy()
    }, [id])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="size-12 animate-spin rounded-full border-4 border-neutral-700 border-t-green-500" />
            </div>
        )
    }

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
        ...strategy,
    }

    return (
        <div>
            <StrategyDetailsTop />

            <div className='bg-white/5 rounded-xl p-3 sm:p-5 mt-8'>
                <StrategyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-6">
                    {activeTab === 'details' ? <StrategyDetailsTab strategyData={strategyData} /> : <BacktestingTab strategyData={strategyData} />}
                </div>
            </div>
        </div>
    )
}
