'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({
  className,
  size = 'md',
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        {
          'h-4 w-4 border-2': size === 'sm',
          'h-8 w-8': size === 'md',
          'h-12 w-12': size === 'lg',
        },
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
