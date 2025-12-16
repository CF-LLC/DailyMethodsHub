'use client'

import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import NotificationCenter from '@/components/notifications/NotificationCenter'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  title?: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    getUser()
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* User email at the top left */}
        {userEmail && (
          <div className="flex items-center gap-2 pl-12 lg:pl-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">
              {userEmail}
            </span>
          </div>
        )}

        {/* Page title (hidden on mobile when sidebar button is visible) */}
        <div className="flex-1">
          {title && (
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
