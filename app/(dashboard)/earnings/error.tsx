'use client'

export default function EarningsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          {error.message || 'Failed to load earnings data. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
