import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { instanceService, InstanceOverview } from '@/services/instanceService'
import toast from 'react-hot-toast'
import StrategyCard from './StrategyCard'


function mapDirection(dir: 'LONG' | 'SHORT' | 'BOTH'): 'Long' | 'Short' | 'Both' {
    if (dir === 'LONG') return 'Long'
    if (dir === 'SHORT') return 'Short'
    return 'Both'
}

function mapStatus(status: InstanceOverview['status']): 'Running' | 'Stopped' | 'Starting' | 'Stopping' | 'Draft' {
    if (status === 'LIVE') return 'Running'
    if (status === 'STOPPED') return 'Stopped'
    if (status === 'STARTING') return 'Starting'
    if (status === 'STOPPING') return 'Stopping'
    return 'Draft'
}

function parseAllocationValue(strategy: InstanceOverview): number {
    if (Number.isFinite(strategy.allocationValue)) return Number(strategy.allocationValue)
    if (Number.isFinite(strategy.allocatedCapital)) return Number(strategy.allocatedCapital)
    if (typeof strategy.allocation === 'string') {
        const normalized = Number(strategy.allocation.replace(/[^0-9.-]+/g, ''))
        return Number.isFinite(normalized) ? normalized : 0
    }
    return 0
}

export default function StrategyGrid() {
    const [strategies, setStrategies] = useState<InstanceOverview[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
    const navigate = useNavigate()
    const pollingTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())
    const pollingAttemptsRef = useRef<Map<string, number>>(new Map())

    const fetchStrategies = async () => {
        try {
            setIsLoading(true)
            const response = await instanceService.getOverview()
            setStrategies(response.data)
            
            // Start polling for any instances in transition state
            response.data.forEach((strategy) => {
                if (strategy.status === 'STARTING' || strategy.status === 'STOPPING') {
                    // Only start polling if not already polling
                    if (!pollingTimersRef.current.has(strategy.id)) {
                        startPolling(strategy.id)
                    }
                }
            })
        } catch (error) {
            console.error('Failed to fetch strategies:', error)
            toast.error('Failed to load strategies')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStrategies()

        // Cleanup all polling timers on unmount
        return () => {
            pollingTimersRef.current.forEach((timer) => clearTimeout(timer))
            pollingTimersRef.current.clear()
            pollingAttemptsRef.current.clear()
        }
    }, [])

    // Stop polling for a specific instance
    const stopPolling = (instanceId: string) => {
        const timer = pollingTimersRef.current.get(instanceId)
        if (timer) {
            clearTimeout(timer)
            pollingTimersRef.current.delete(instanceId)
            pollingAttemptsRef.current.delete(instanceId)
        }
    }

    // Fetch single instance and update in state
    const refreshSingleInstance = async (instanceId: string) => {
        try {
            const response = await instanceService.getOverview()
            const updatedInstance = response.data.find((inst) => inst.id === instanceId)
            
            if (updatedInstance) {
                setStrategies((prev) =>
                    prev.map((strategy) =>
                        strategy.id === instanceId ? updatedInstance : strategy
                    )
                )

                // Check if still in transition state
                if (updatedInstance.status === 'STARTING' || updatedInstance.status === 'STOPPING') {
                    // Continue polling with progressive intervals
                    scheduleNextPoll(instanceId)
                } else {
                    // Transition complete, stop polling
                    stopPolling(instanceId)
                }
            }
        } catch (error) {
            console.error(`Failed to refresh instance ${instanceId}:`, error)
            // Continue polling even on error
            scheduleNextPoll(instanceId)
        }
    }

    // Schedule next poll with progressive intervals
    const scheduleNextPoll = (instanceId: string) => {
        const attempt = pollingAttemptsRef.current.get(instanceId) || 0
        pollingAttemptsRef.current.set(instanceId, attempt + 1)

        let delay: number
        if (attempt === 0) {
            delay = 5000 // First poll: 5 seconds
        } else if (attempt === 1) {
            delay = 10000 // Second poll: 10 seconds
        } else {
            delay = 30000 // Subsequent polls: 30 seconds
        }

        const timer = setTimeout(() => {
            refreshSingleInstance(instanceId)
        }, delay)

        pollingTimersRef.current.set(instanceId, timer)
    }

    // Start polling for an instance
    const startPolling = (instanceId: string) => {
        // Reset attempt counter
        pollingAttemptsRef.current.set(instanceId, 0)
        // Schedule first poll
        scheduleNextPoll(instanceId)
    }

    const handleToggleStatus = async (id: string, currentStatus: InstanceOverview['status']) => {
        // Prevent double-clicks while already processing
        if (togglingIds.has(id)) {
            return
        }

        try {
            // Mark as toggling to disable button immediately
            setTogglingIds(prev => new Set(prev).add(id))

            if (currentStatus === 'LIVE') {
                await instanceService.stopInstance(id, 'User manual stop')
                toast.success('Strategy stopping...')
            } else if (currentStatus === 'STOPPED' || currentStatus === 'DRAFT') {
                await instanceService.startInstance(id)
                toast.success('Strategy starting...')
            } else {
                toast.error('Cannot toggle status while strategy is transitioning')
                return
            }
            
            // Refresh the strategies list immediately
            await fetchStrategies()
            
            // Start polling to track transition status
            startPolling(id)
        } catch (error: any) {
            console.error('Failed to toggle strategy status:', error)
            toast.error(error?.response?.data?.message || 'Failed to toggle strategy status')
        } finally {
            // Remove from toggling set after API call completes
            setTogglingIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(id)
                return newSet
            })
        }
    }

    if (isLoading) {
        return (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-80 animate-pulse rounded-xl bg-neutral-800/50" />
                ))}
            </div>
        )
    }

    if (strategies.length === 0) {
        return (
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 py-20">
                <p className="text-lg text-neutral-400">No strategies found.</p>
                <p className="mt-2 text-sm text-neutral-500">Create your first strategy to get started.</p>
            </div>
        )
    }

    return (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {strategies.map((strategy) => (
                <StrategyCard
                    key={strategy.id}
                    apiKey="binance-api-key"
                    strategyName={strategy?.strategyName ?? ''}
                    status={mapStatus(strategy?.status ?? 'DRAFT')}
                    pair={strategy?.symbols?.length ? strategy.symbols : strategy.tradingPair ? [strategy.tradingPair] : []}
                    direction={mapDirection(strategy?.direction ?? 'BOTH')}
                    allocation={parseAllocationValue(strategy)}
                    onToggleStatus={() => handleToggleStatus(strategy.id, strategy.status)}
                    onViewDetails={() => navigate(`/strategy-management/${strategy.id}`)}
                    isToggling={togglingIds.has(strategy.id) || strategy?.status === 'STARTING' || strategy?.status === 'STOPPING'}
                />
            ))}
        </div>
    )
}
