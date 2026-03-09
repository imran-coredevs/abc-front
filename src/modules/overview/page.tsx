import { StatsCard } from '@/components/ui/stats-card'
import OverviewTop from './components/OverviewTop'
import StrategyOverviewTable from './components/StrategyOverviewTable'
import imgVuesaxBoldVideoCircle from '@/assets/icon/imgVuesaxBoldVideoCircle.svg'
import imgVuesaxBoldLayer from '@/assets/icon/imgVuesaxBoldLayer.svg'
import imgVuesaxBoldChart from '@/assets/icon/imgVuesaxBoldChart.svg'
import imgVuesaxBoldWallet from '@/assets/icon/imgVuesaxBoldWallet.svg'
import imgVuesaxBoldGraph from '@/assets/icon/imgVuesaxBoldGraph.svg'
import imgVuesaxBoldMoney from '@/assets/icon/imgVuesaxBoldMoney.svg'

export default function OverviewPage() {
    const statsData = [
        {
            id: 1,
            title: 'Portfolio',
            description: 'Total capital currently allocated',
            quantity: '100,02,680.90',
            icon: (
                <div className="relative size-6">
                    <img alt="" className="absolute block size-full max-w-none" src={imgVuesaxBoldGraph} />
                </div>
            ),
            variant: 'progress' as const,
            progressPercent: 42,
            amountIcon: (
                <div className="relative size-6 shrink-0">
                    <img alt="" className="absolute block size-full max-w-none" src={imgVuesaxBoldWallet} />
                </div>
            ),
            isLoading: false,
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
            quantity: '+124.50',
            variant: 'increase' as const,
            increaseText: '2.3% Yesterday',
            amountIcon: (
                <div className="relative size-6 shrink-0">
                    <img alt="" className="absolute block size-full max-w-none" src={imgVuesaxBoldMoney} />
                </div>
            ),
            isLoading: false,
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
            quantity: '12',
            variant: 'simple' as const,
            isLoading: false,
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
            quantity: '03',
            variant: 'simple' as const,
            isLoading: false,
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

            <StrategyOverviewTable />
        </>
    )
}
