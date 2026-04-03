import { cn } from '@/lib/utils'
import { resolveAssetUrl } from '@/lib/utils'
import { useEffect, useState } from 'react'

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
    imgClassName?: string
    avatar?: boolean
    fallbackText?: string
}

export default function ImageWrapper({ imgClassName, className, avatar = false, fallbackText, ...props }: Props) {
    const fallbackLetter = fallbackText?.trim().slice(0, 1).toUpperCase() || 'U'
    const resolvedSrc = resolveAssetUrl(typeof props.src === 'string' ? props.src : undefined)
    const [imageFailed, setImageFailed] = useState(false)

    useEffect(() => {
        setImageFailed(false)
    }, [resolvedSrc])

    return (
        <div className={cn('flex size-16 items-center justify-center', className)}>
            {avatar ? (
                !resolvedSrc || imageFailed ? (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-700 text-base font-semibold text-white">
                        {fallbackLetter}
                    </div>
                ) : (
                    <img
                        className={cn('h-full w-full object-cover', imgClassName)}
                        {...props}
                        src={resolvedSrc}
                        onError={(event) => {
                            setImageFailed(true)
                            props.onError?.(event)
                        }}
                    />
                )
            ) : (
                <img
                    className={cn('h-full w-full object-cover', imgClassName)}
                    {...props}
                    src={resolvedSrc || undefined}
                    onError={(event) => {
                        props.onError?.(event)
                    }}
                />
            )}
        </div>
    )
}
