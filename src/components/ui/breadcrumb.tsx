import { ArrowRight2 } from 'iconsax-reactjs'
import React from 'react'
import { Link } from 'react-router'

type Props = { breadcrumbs: Breadcrumb[] }

export default function Breadcrumb({ breadcrumbs }: Props) {
    return (
        <div className="flex items-center gap-2">
            {breadcrumbs.map((item, idx) => (
                <React.Fragment key={idx}>
                    {idx !== breadcrumbs.length - 1 ? (
                        <>
                            <Link to={item.href as string} className="p-md text-neutral-400">
                                {item.title}
                            </Link>

                            <ArrowRight2 className="size-5 text-neutral-400" />
                        </>
                    ) : (
                        <span className="p-md text-neutral-500">{item.title}</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
