type BadgeVariant = 'success' | 'warning' | 'danger' | 'outline' | 'cold'

// Use a generic type T for table data rows
type BaseTableColumn<T = Record<string, unknown>> = {
    key: string
    title: string
    render?: (data: T) => React.ReactNode
}

type DynamicTableColumn<T = Record<string, unknown>> = BaseTableColumn<T> & {
    type?: 'dynamic' | 'object'
}

type StatusTableColumn<T = Record<string, unknown>> = BaseTableColumn<T> & {
    type: 'status'
    statusOptions: { key: string; value: string; type: BadgeVariant }[]
}

type TableColumn<T = Record<string, unknown>> = DynamicTableColumn<T> | StatusTableColumn<T>

type TableActions<T = Record<string, unknown>> = {
    type: 'edit' | 'view' | 'download' | 'delete'
    onClick: (row: T) => void
}

type TablePagination = Pagination & {
    onPageChange: (newPage: number) => void
}
