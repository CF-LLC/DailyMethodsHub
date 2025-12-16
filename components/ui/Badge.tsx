import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'success' | 'error' | 'warning'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-gray-100 text-gray-800': variant === 'secondary',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-red-100 text-red-800': variant === 'error',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
