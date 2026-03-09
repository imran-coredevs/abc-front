import React from 'react'

type Props = { title: string; subTitle?: string; children: React.ReactNode }

export default function SettingsWrapper({ title, subTitle, children }: Props) {
    return (
        <div className="flex flex-col gap-5 rounded-xl p-4 lg:p-4">
            <div className="flex flex-col gap-2">
                <span className="text-xl sm:text-2xl font-semibold text-neutral-50">{title}</span>
                {subTitle && <span className="text-sm sm:p-md text-neutral-400">{subTitle}</span>}
            </div>
            {children}
        </div>
    )
}
