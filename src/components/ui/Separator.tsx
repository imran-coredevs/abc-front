import { cn } from '@/lib/utils'

type Props = React.HTMLAttributes<HTMLDivElement> & { direction?: 'row' | 'col' }

export default function Separator({ direction = 'row', ...props }: Props) {
    return (
        <div
            className={cn(
                direction === 'row' ? 'h-[1px] w-full bg-neutral-600' : 'w-[1px] self-stretch bg-neutral-600',
                props.className,
            )}
        />
    )
}
