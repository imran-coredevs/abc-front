import React from 'react'

interface CardBgProps extends React.SVGProps<SVGSVGElement> {
    className?: string
    color?: string
    width?: number | string
    height?: number | string
    opacity?: number
}

export const CardBg: React.FC<CardBgProps> = ({
    className,
    color = 'currentColor',
    width = 263,
    height = 113,
    opacity = 0.3,
    ...props
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 263 113"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <g opacity={opacity} filter="url(#filter0_f_138_934)">
                <circle cx="131" cy="113" r="50" fill={color} />
            </g>

            <defs>
                <filter
                    id="filter0_f_138_934"
                    x="-3"
                    y="-21"
                    width="268"
                    height="268"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="42" result="effect1_foregroundBlur_138_934" />
                </filter>
            </defs>
        </svg>
    )
}
