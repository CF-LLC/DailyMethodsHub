import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  gradient?: boolean
  className?: string
}

export function PageHeader({ 
  title, 
  description, 
  icon, 
  action,
  gradient = false,
  className 
}: PageHeaderProps) {
  if (gradient) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-8 text-primary-foreground shadow-xl mb-8",
        className
      )}>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  {icon as ReactNode}
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold">{title}</h1>
                {description && (
                  <p className="text-lg text-primary-foreground/90 mt-2 max-w-2xl">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>
    )
  }

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {icon as ReactNode}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}
