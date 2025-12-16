import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoadingSpinner className="h-12 w-12" />
    </div>
  )
}
