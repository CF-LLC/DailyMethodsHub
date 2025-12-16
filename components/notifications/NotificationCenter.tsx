'use client'

import { useEffect, useState } from 'react'
import { getUserNotifications, getUnreadCount } from '@/app/actions/notifications'
import NotificationBell from '@/components/notifications/NotificationBell'
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown'
import { useToast } from '@/components/providers/ToastProvider'

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
}

export default function NotificationCenter() {
  const { showToast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const result = await getUserNotifications()
      if (result.success && result.data) {
        setNotifications(result.data)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const result = await getUnreadCount()
      if (result.success && typeof result.data === 'number') {
        setUnreadCount(result.data)
      }
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Refresh notifications when opening
      loadNotifications()
    }
  }

  const handleNotificationUpdate = () => {
    loadNotifications()
    loadUnreadCount()
  }

  return (
    <div className="relative">
      <NotificationBell
        unreadCount={unreadCount}
        isOpen={isOpen}
        onClick={handleToggle}
      />
      {isOpen && (
        <NotificationsDropdown
          notifications={notifications}
          loading={loading}
          onClose={() => setIsOpen(false)}
          onUpdate={handleNotificationUpdate}
        />
      )}
    </div>
  )
}
