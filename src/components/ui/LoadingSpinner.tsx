import React from 'react'

const LoadingSpinner: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950">
            <div className="border-blue-700 h-16 w-16 animate-spin rounded-full border-t-4 border-b-4"></div>
        </div>
    )
}

export default LoadingSpinner
