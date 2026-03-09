import Separator from '@/components/ui/Separator'
import React from 'react'

interface SettingsSidebarProps {
    setSelectedPage: (page: string) => void
    selectedPage: string
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ setSelectedPage, selectedPage }) => {
    const pages = [
        { name: 'configuration', label: 'Configuration' },
        { name: 'profile', label: 'Profile Settings' },
        { name: 'password', label: 'Manage Password' },
    ]

    return (
        <div className="flex flex-col gap-5 py-10 pl-6">
            <h2 className="text-2xl font-semibold">Settings Options</h2>
            <Separator />
            <div className="flex flex-col gap-2">
                {pages.map((page) => (
                    <button
                        key={page.name}
                        onClick={() => setSelectedPage(page.name)}
                        className={`rounded-md px-4 py-2 text-left text-lg text-neutral-50 ${selectedPage === page.name ? 'cursor-not-allowed bg-neutral-800' : 'cursor-pointer hover:bg-neutral-700'}`}
                    >
                        {page.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SettingsSidebar
