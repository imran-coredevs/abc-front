import { cn } from '@/lib/utils'
import { Edit2, Eye, ReceiveSquare, Trash } from 'iconsax-reactjs'
import { Badge } from '../badge'

type Props<T> = { columns: TableColumn<T>[]; tableData: T[]; actions?: TableActions<T>[] }

export default function Table<T extends Record<string, unknown>>({ columns, tableData, actions }: Props<T>) {
    const renderRows = (col: TableColumn<T>, row: T) => {
        const value = row[col.key as keyof typeof row]

        switch (col.type) {
            case 'dynamic':
                return col.render?.(row)

            case 'status': {
                const status = col.statusOptions?.find((status) => status.key === value)

                return (
                    <div className="flex items-start">
                        <Badge
                            className={cn('overline-1 w-[6.5rem] rounded-lg bg-neutral-800 p-2 font-medium capitalize')}
                            variant={status?.type || 'outline'}
                        >
                            {value as React.ReactNode}
                        </Badge>
                    </div>
                )
            }

            default:
                return value ? (value as React.ReactNode) : '-----------'
        }
    }

    const renderActions = (action: TableActions<T>) => {
        switch (action.type) {
            case 'edit':
                return <Edit2 className="size-full" />

            case 'download':
                return <ReceiveSquare className="size-full" />

            case 'view':
                return <Eye className="size-full" />
            case 'delete':
                return <Trash className="size-full" />
        }
    }

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-full">
                <thead>
                    <tr className="bg-white/5">
                        {columns.map((col, idx) => (
                            <th
                                key={col.title}
                                className={cn(
                                    'font-mulish p-3 text-left text-sm font-bold text-neutral-50',
                                    idx === 0 && 'rounded-tl-lg',
                                    !actions?.length && idx === columns.length - 1 && 'rounded-tr-lg',
                                )}
                            >
                                {col.title}
                            </th>
                        ))}

                        {actions && (
                            <th className="font-mulish rounded-tr-lg bg-white/5 p-3 text-left text-sm font-bold text-neutral-50">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} className={cn(rowIndex % 2 !== 0 && 'bg-white/5')}>
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={cn(
                                        'h-20 p-3',
                                        colIndex === 0 && rowIndex === tableData.length - 1 && 'rounded-bl-lg',
                                        !actions?.length &&
                                            colIndex === columns.length - 1 &&
                                            rowIndex === tableData.length - 1 &&
                                            'rounded-br-lg',
                                    )}
                                >
                                    {renderRows(col, row)}
                                </td>
                            ))}

                            {actions && (
                                <td className={cn('p-3', rowIndex === tableData.length - 1 && 'rounded-br-lg')}>
                                    <div className="flex items-center justify-start gap-2">
                                        {actions.map((action, actionIdx) => (
                                            <div
                                                key={actionIdx}
                                                onClick={() => action.onClick(row)}
                                                className="size-[18px] cursor-pointer text-orange-500"
                                                title={action.type}
                                            >
                                                {renderActions(action)}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
