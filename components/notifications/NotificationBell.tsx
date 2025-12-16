'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface NotificationBellProps {
  unreadCount: number
  isOpen: boolean
  onClick: () => void
}

export default function NotificationBell({ unreadCount, isOpen, onClick }: NotificationBellProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label="Notifications"
    >
      <Bell className={`h-5 w-5 transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : ''}`} />
      {unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  )
}
