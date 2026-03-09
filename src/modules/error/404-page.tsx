export default function NotFoundPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-neutral-950 text-neutral-50">
            <div className="text-center">
                <h1 className="text-lime-green-500 text-6xl font-bold">404</h1>
                <p className="mt-4 text-2xl">Page Not Found</p>
                <p className="mt-2 text-neutral-300">The page you're looking for doesn't exist or has been moved.</p>
                <a
                    href="/"
                    className="bg-lime-green-500 hover:bg-lime-green-600 mt-6 inline-block rounded-md px-6 py-3 text-neutral-950 transition-colors"
                >
                    Go to Homepage
                </a>
            </div>
        </div>
    )
}
