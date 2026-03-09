import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function OverviewTop() {
    const isApiConnected = true // Mock API connection status
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-neutral-50">Overview</h1>
                <p className="text-sm text-neutral-400">
                    Monitor your trading strategies, capital allocation, and recent activity at a glance
                </p>
            </div>

            <div className="flex items-center gap-4">
                {/* API Connection Status */}
                <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                    <span className="text-sm text-neutral-50">API Connection:</span>
                    <div className="rounded-full bg-neutral-900 px-4 py-2">
                        <span className={`text-sm font-medium ${isApiConnected ? 'text-green-500' : 'text-red-500'}`}>
                            {isApiConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>

                {/* Create Instance Button */}
                <Button onClick={() => navigate('/strategy-management/create')}>Create Strategy</Button>
            </div>
        </div>
    )
}
