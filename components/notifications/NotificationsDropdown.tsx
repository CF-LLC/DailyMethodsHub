'use client'

import { useEffect, useRef } from 'react'
import { X, Check, Trash2, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/app/actions/notifications'
import { useToast } from '@/components/providers/ToastProvider'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/Button'

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
}

interface NotificationsDropdownProps {
  notifications: Notification[]
  loading: boolean
  onClose: () => void
  onUpdate: () => void
}

export default function NotificationsDropdown({ 
  notifications, 
  loading, 
  onClose, 
  onUpdate 
}: NotificationsDropdownProps) {
  const { showToast } = useToast()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead(id)
    if (result.success) {
      onUpdate()
    } else {
      showToast('error', result.error || 'Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsAsRead()
    if (result.success) {
      showToast('success', 'All notifications marked as read')
      onUpdate()
    } else {
      showToast('error', result.error || 'Failed to mark all as read')
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteNotification(id)
    if (result.success) {
      showToast('success', 'Notification deleted')
      onUpdate()
    } else {
      showToast('error', result.error || 'Failed to delete notification')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      default:
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    }
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notifications
        </h3>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.read) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Info className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
