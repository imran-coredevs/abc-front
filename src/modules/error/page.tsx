// import Button from '@/Components/ui/Button';

type Props = {
    error?: Error | null
    _onGoHome?: () => void
    _onRefresh?: () => void
    _onGoBack?: () => void
}

const ErrorPage = ({ error }: Props) => {
    // Determine error type and message
    const getErrorInfo = () => {
        const hasStatus = (err: Error | null): err is { status: number } => {
            return typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number';
        }

        if (hasStatus(error) && error.status === 404) {
            return {
                title: 'Page Not Found',
                message: "The page you're looking for doesn't exist or may have been moved.",
                code: '404',
            }
        }

        if (hasStatus(error) && error.status >= 500) {
            return {
                title: 'Server Error',
                message: 'Something went wrong on our end. Please try again later.',
                code: error.status.toString(),
            }
        }

        return {
            title: 'Something went wrong',
            message: error?.message || 'An unexpected error occurred. Please try again.',
            code: 'Error',
        }
    }

    const { title, message, code } = getErrorInfo()

    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                {/* Error Code */}
                <div className="mb-4 text-6xl font-bold text-red-300">{code}</div>

                {/* Error Title */}
                <h1 className="text-light_blue-600 mb-2 text-2xl font-bold">{title}</h1>

                {/* Error Message */}
                <p className="mb-8 text-gray-600">{message}</p>

                {/* Debug info in development */}
                {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && error && (
                    <details className="mt-8 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                            Error Details (Development)
                        </summary>
                        <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs text-gray-700">
                            {error.stack || JSON.stringify(error, null, 2)}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    )
}

export default ErrorPage
