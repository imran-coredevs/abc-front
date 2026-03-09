import React from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {}

export default function TableWrapper({ ...props }: Props) {
    return (
        <div className="w-full space-y-6 rounded-2xl bg-neutral-900 p-6 backdrop-blur-2xl">
            {props.children}
        </div>
    )
}
