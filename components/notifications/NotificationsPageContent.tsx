'use client'

import { useState } from 'react'
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react'
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/app/actions/notifications'
import { useToast } from '@/components/providers/ToastProvider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
}

interface NotificationsPageContentProps {
  initialNotifications: Notification[]
}

export default function NotificationsPageContent({ initialNotifications }: NotificationsPageContentProps) {
  const { showToast } = useToast()
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead(id)
    if (result.success) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsAsRead()
    if (result.success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      showToast('success', 'All notifications marked as read')
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteNotification(id)
    if (result.success) {
      setNotifications(prev => prev.filter(n => n.id !== id))
      showToast('success', 'Notification deleted')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : "All caught up!"}
        icon={<Bell className="h-6 w-6" />}
        action={
          unreadCount > 0 ? (
            <Button onClick={handleMarkAllAsRead} variant="secondary">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-4 py-2 font-medium transition-colors border-b-2',
            filter === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            'px-4 py-2 font-medium transition-colors border-b-2',
            filter === 'unread'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'border rounded-lg p-4 transition-all',
                !notification.read && 'bg-accent/50 border-primary/20'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold flex-shrink-0',
                  getNotificationColor(notification.type)
                )}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(
                      'font-medium',
                      !notification.read && 'font-semibold'
                    )}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(notification.id)}
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
