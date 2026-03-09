import { Button } from '@/components/ui/button'
import { useState } from 'react'
import ConfigurationSettingsPage from './components/ConfigurationSettingsPage'
import ManagePassword from './components/ManagePassword'

export default function SettingsPage() {
    const [selectedPage, setSelectedPage] = useState('configuration')

    const pages = [
        { name: 'configuration', label: 'Configuration' },
        { name: 'password', label: 'Manage Password' },
    ]

    const renderContent = () => {
        switch (selectedPage) {
            case 'configuration':
                return <ConfigurationSettingsPage />
            case 'password':
                return <ManagePassword />
            default:
                return <ConfigurationSettingsPage />
        }
    }

    return (
        <div>
            {/* Tab Navigation */}
            <div className="space-y-6 border-b border-neutral-700 bg-neutral-950/50 pb-4">
                <div className="scrollbar-hide flex gap-5 overflow-x-auto">
                    {pages.map((page) => (
                        <Button
                            key={page.name}
                            onClick={() => setSelectedPage(page.name)}
                            variant="secondary"
                            className={`bg-transparent whitespace-nowrap ${selectedPage === page.name ? 'border-blue-700/80' : 'border-white/20 hover:border-blue-700/40'}`}
                        >
                            {page.label}
                        </Button>
                    ))}
                </div>

                <div className="inline-flex flex-col items-start justify-start gap-2">
                    <div className="inline-flex items-center justify-start gap-3 self-stretch">
                        <div className="text-neutral-50 justify-start text-2xl leading-8 font-semibold">
                            Exchange Connections
                        </div>
                    </div>
                    <div className="justify-start text-base leading-5 font-normal text-neutral-400">
                        Connect your Binance account to enable live trading and strategy execution
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mt-6">{renderContent()}</div>
        </div>
    )
}
