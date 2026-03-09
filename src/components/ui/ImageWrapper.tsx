import { cn } from '@/lib/utils'
import { User } from 'iconsax-reactjs'

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { imgClassName?: string; avatar?: boolean }

export default function ImageWrapper({ imgClassName, className, avatar = false, ...props }: Props) {
    return (
        <div className={cn('flex size-16 items-center justify-center', className)}>
            {avatar ? (
                !props.src ? (
                    <User
                        variant="Bold"
                        className="size-full overflow-clip rounded-full border-2 border-neutral-400 p-2 text-neutral-200"
                    />
                ) : (
                    <img className={cn('h-full w-full object-cover', imgClassName)} {...props} />
                )
            ) : (
                <img className={cn('h-full w-full object-cover', imgClassName)} {...props} />
            )}
        </div>
    )
}
