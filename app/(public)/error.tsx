'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-bold">Something went wrong</h1>
        <p className="mb-8 text-gray-600">
          We encountered an error while loading this page.
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
