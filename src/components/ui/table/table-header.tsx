import Separator from '../Separator'

type Props = React.HTMLAttributes<HTMLDivElement> & { title: string; subTitle?: string }

export default function TableHeader({ title, subTitle, ...props }: Props) {
    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between pb-6">
                <div className="flex flex-col gap-2">
                    <span className="text-[20px] font-semibold text-neutral-50">{title}</span>
                    {subTitle && <span className="p-sm text-neutral-600">{subTitle}</span>}
                </div>

                <div>{props.children}</div>
            </div>

            <Separator />
        </>
    )
}
