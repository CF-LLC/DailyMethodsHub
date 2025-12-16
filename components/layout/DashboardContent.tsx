'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      // Listen for custom event from Sidebar
      const handleCollapse = (e: CustomEvent) => {
        setIsCollapsed(e.detail.isCollapsed)
      }
      window.addEventListener('sidebar-collapse' as any, handleCollapse as any)
      return () => {
        window.removeEventListener('sidebar-collapse' as any, handleCollapse as any)
      }
    }
    handleResize()
  }, [])

  return (
    <div className={cn(
      'flex flex-1 flex-col overflow-hidden transition-all duration-300',
      isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
    )}>
      {children}
    </div>
  )
}
