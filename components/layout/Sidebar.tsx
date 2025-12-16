'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  List, 
  Settings, 
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { signOut } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/client'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Methods',
    href: '/methods',
    icon: List,
  },
  {
    name: 'Referral Hub',
    href: '/referral-hub',
    icon: Users,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    getUser()
  }, [])

  useEffect(() => {
    // Emit collapse state change
    window.dispatchEvent(new CustomEvent('sidebar-collapse', { detail: { isCollapsed } }))
  }, [isCollapsed])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Desktop collapse toggle */}
      {!isMobileMenuOpen && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'hidden lg:flex fixed top-4 z-50 transition-all',
            isCollapsed ? 'left-20' : 'left-60'
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={cn('flex h-16 items-center border-b', isCollapsed ? 'justify-center px-2' : 'px-6')}>
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-lg font-bold">D</span>
              </div>
              {!isCollapsed && <span className="text-lg font-semibold">Daily Methods</span>}
            </Link>
          </div>

          {/* User Info Section */}
          {userEmail && (
            <div className={cn('border-b p-4', isCollapsed && 'px-2')}>
              <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{userEmail}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={cn('flex-1 space-y-1 p-4', isCollapsed && 'px-2')}>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isCollapsed ? 'justify-center' : 'space-x-3',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className={cn('border-t p-4 space-y-4', isCollapsed && 'px-2')}>
            <Button
              variant="ghost"
              className={cn(
                'w-full',
                isCollapsed ? 'justify-center px-2' : 'justify-start'
              )}
              onClick={handleSignOut}
              title={isCollapsed ? 'Sign out' : undefined}
            >
              <LogOut className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
              {!isCollapsed && 'Sign out'}
            </Button>
            {!isCollapsed && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs font-medium">Daily Methods Hub</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Version 1.0.0
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
