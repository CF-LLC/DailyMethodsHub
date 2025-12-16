import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function EarningsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  )
}
