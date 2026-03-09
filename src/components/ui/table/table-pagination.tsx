import { ArrowLeft2, ArrowRight2 } from 'iconsax-reactjs'
import Seperator from '../Separator'

type Props = { paginationOptions: TablePagination; tableName?: string }

export default function TablePagination({ paginationOptions, tableName }: Props) {
    const {
        pagingCounter = 1,
        limit = 10,
        totalPages = 1,
        totalDocs = 0,
        hasNextPage = false,
        hasPrevPage = false,
        onPageChange,
        page = 1,
    } = paginationOptions

    const startRecord = pagingCounter
    const endRecord = Math.min(startRecord + limit - 1, totalDocs as number)

    const getPageNumbers = () => {
        const pages: (number | '...')[] = []
        const range = 2 // Range of pages before and after the current page

        // Show the first page
        if (page > range + 1) {
            pages.push(1)
            pages.push('...')
        }

        // Add pages before the current page
        for (let i = Math.max(page - range, 1); i < page; i++) {
            pages.push(i)
        }

        // Always include the current page
        pages.push(page)

        // Add pages after the current page
        for (let i = page + 1; i <= Math.min(page + range, totalPages); i++) {
            pages.push(i)
        }

        // Show the last page
        if (page < totalPages - range) {
            pages.push('...')
            pages.push(totalPages)
        }

        return pages
    }

    return (
        <div className="space-y-6">
            <Seperator />

            <div className="flex flex-col lg:flex-row gap-4 w-full items-center justify-between rounded-lg p-3">
                <div>
                    <span className="text-neutral-500">
                        Showing {startRecord}-{endRecord} of {totalDocs} {tableName || 'items'}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={!hasPrevPage}
                        className="size-7 cursor-pointer disabled:cursor-not-allowed disabled:opacity-20"
                    >
                        <ArrowLeft2 className="size-full text-neutral-200" variant="Bold" />
                    </button>

                    {/* Page Numbers with Ellipses */}
                    {getPageNumbers().map((p, index) =>
                        p === '...' ? (
                            <span key={index} className="text-gray-4 px-2">
                                ...
                            </span>
                        ) : (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onPageChange(p as number)}
                                disabled={page === p}
                                className={`p-md size-7 cursor-pointer rounded-md px-1 font-semibold ${
                                    page === p
                                        ? 'bg-blue-700 text-neutral-950 disabled:cursor-not-allowed'
                                        : 'bg-transparent text-neutral-200'
                                }`}
                            >
                                {p}
                            </button>
                        ),
                    )}

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={!hasNextPage}
                        className="size-7 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowRight2 className="size-full text-neutral-400" variant="Bold" />
                    </button>
                </div>
            </div>
        </div>
    )
}
