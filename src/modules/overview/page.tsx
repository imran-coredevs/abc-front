import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/ui/stats-card'
import OverviewTop from './components/OverviewTop'
import StrategyOverviewTable from './components/StrategyOverviewTable'
import imgVuesaxBoldVideoCircle from '@/assets/icon/imgVuesaxBoldVideoCircle.svg'
import imgVuesaxBoldLayer from '@/assets/icon/imgVuesaxBoldLayer.svg'
import imgVuesaxBoldChart from '@/assets/icon/imgVuesaxBoldChart.svg'
import imgVuesaxBoldWallet from '@/assets/icon/imgVuesaxBoldWallet.svg'
import imgVuesaxBoldGraph from '@/assets/icon/imgVuesaxBoldGraph.svg'
import imgVuesaxBoldMoney from '@/assets/icon/imgVuesaxBoldMoney.svg'
import { instanceService, DashboardResponse, InstanceOverview } from '@/services/instanceService'

export default function OverviewPage() {
    const [dashboardData, setDashboardData] = useState<DashboardResponse['data'] | null>(null)
    const [overviewData, setOverviewData] = useState<InstanceOverview[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const [dashboard, overview] = await Promise.all([
                    instanceService.getDashboard(),
                    instanceService.getOverview(),
                ])
                setDashboardData(dashboard.data)
                setOverviewData(overview.data)
            } catch (error) {
                console.error('Failed to fetch overview data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const statsData = [
        {
            id: 1,
            title: 'Portfolio',
            description: 'Total capital currently allocated',
            quantity: dashboardData
                ? `$${dashboardData?.portfolio?.totalAllocatedCapital?.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                  }) ?? '0.00'}`
                : '$0.00',
            icon: (
                <div className="relative size-6">
                    <img alt="" className="absolute block size-full max-w-none" src={imgVuesaxBoldGraph} />
                </div>
            ),
            variant: 'progress' as const,
            progressPercent: dashboardData ? Math.round(dashboardData?.portfolio?.allocatedPercentage ?? 0) : 0,
            amountIcon: (
                <div className="relative size-6 shrink-0">
                    <img alt="" className="absolute block size-full max-w-none" src={imgVuesaxBoldWallet} />
                </div>
            ),
            isLoading,
        },
        {
            id: 2,
            title: "Today's Performance",
            description: 'Profit or loss generated today',
            icon: (
                <div className="relative size-6">
                    <img alt="" className="absolute block size-full max-w-none" src={imgVuesaxBoldChart} />
                </div>
            ),
            quantity: dashboardData
                ? `${(dashboardData?.todaysPerformance?.pnl ?? 0) >= 0 ? '+' : ''}$${Math.abs(
                      dashboardData?.todaysPerformance?.pnl ?? 0,
                  ).toFixed(2)}`
                : '$0.00',
            variant: 'increase' as const,
            increaseText: dashboardData
                ? `${(dashboardData?.todaysPerformance?.percentageChange ?? 0) >= 0 ? '+' : ''}${(dashboardData?.todaysPerformance?.percentageChange ?? 0).toFixed(2)}% of Portfolio`
                : '0.00% of Portfolio',
            amountIcon: (
                <div className="relative size-6 shrink-0">
                    <img alt="" className="absolute block size-full max-w-none" src={imgVuesaxBoldMoney} />
                </div>
            ),
            isLoading,
        },
        {
            id: 3,
            title: 'Total Strategies',
            description: 'Total number of strategies created',
            icon: (
                <div className="relative size-6">
                    <img alt="" className="absolute block size-full max-w-none" src={imgVuesaxBoldLayer} />
                </div>
            ),
            quantity: dashboardData ? (dashboardData?.totalStrategies?.toString() ?? '0') : '0',
            variant: 'simple' as const,
            isLoading,
        },
        {
            id: 4,
            title: 'Active Strategies',
            description: 'Strategies currently executing trades',
            icon: (
                <div className="relative size-6">
                    <img alt="" className="absolute block size-full max-w-none" src={imgVuesaxBoldVideoCircle} />
                </div>
            ),
            quantity: dashboardData ? (dashboardData?.activeStrategies?.toString()?.padStart(2, '0') ?? '00') : '00',
            variant: 'simple' as const,
            isLoading,
        },
    ]

    return (
        <>
            <OverviewTop />

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statsData.map((stat) => (
                    <StatsCard
                        key={stat.id}
                        title={stat.title}
                        description={stat.description}
                        quantity={stat.quantity}
                        icon={stat.icon}
                        variant={stat.variant}
                        progressPercent={stat.progressPercent}
                        increaseText={stat.increaseText}
                        amountIcon={stat.amountIcon}
                        isLoading={stat.isLoading}
                    />
                ))}
            </div>

            <StrategyOverviewTable data={overviewData} isLoading={isLoading} />
        </>
    )
}
