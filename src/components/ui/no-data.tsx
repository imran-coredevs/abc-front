import EmptyState from '@/assets/icon/empty-state.svg?react'

type Props = { text?: string }

export default function NoDataFound({ text }: Props) {
    return (
        <div className="bg-white-50/40 flex flex-col items-center justify-center gap-4 rounded-xl p-8 backdrop-blur-lg">
            <EmptyState />

            <span className="p-md text-neutral-400">{text || 'No Data Found'}</span>
        </div>
    )
}
