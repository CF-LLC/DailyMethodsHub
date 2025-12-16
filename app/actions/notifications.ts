// @ts-nocheck - Temporary: Supabase type inference issues with new tables
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
}

export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}

// Get all notifications for the current user
export async function getUserNotifications(): Promise<ApiResponse<Notification[]>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching notifications:', error)
      return { success: false, error: 'Failed to fetch notifications' }
    }

    const notifications: Notification[] = data.map((n: any) => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      createdAt: n.created_at,
    }))

    return { success: true, data: notifications }
  } catch (error) {
    console.error('Unexpected error in getUserNotifications:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get unread notification count
export async function getUnreadCount(): Promise<ApiResponse<number>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false)

    if (error) {
      console.error('Error fetching unread count:', error)
      return { success: false, error: 'Failed to fetch unread count' }
    }

    return { success: true, data: count || 0 }
  } catch (error) {
    console.error('Unexpected error in getUnreadCount:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('notifications')
      // @ts-expect-error - Supabase type inference issue with new tables
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error marking notification as read:', error)
      return { success: false, error: 'Failed to mark notification as read' }
    }

    revalidatePath('/earnings')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in markNotificationAsRead:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<ApiResponse> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('notifications')
      // @ts-expect-error - Supabase type inference issue
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      return { success: false, error: 'Failed to mark notifications as read' }
    }

    revalidatePath('/earnings')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in markAllNotificationsAsRead:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Create notification (internal use - for system notifications)
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'warning' | 'success' | 'error' = 'info'
): Promise<ApiResponse> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('notifications')
      // @ts-expect-error - Supabase type inference issue
      .insert([{
        user_id: userId,
        title,
        message,
        type,
      }])

    if (error) {
      console.error('Error creating notification:', error)
      return { success: false, error: 'Failed to create notification' }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in createNotification:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Delete notification
export async function deleteNotification(notificationId: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting notification:', error)
      return { success: false, error: 'Failed to delete notification' }
    }

    revalidatePath('/earnings')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in deleteNotification:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Export aliases for compatibility
export const markAsRead = markNotificationAsRead
export const markAllAsRead = markAllNotificationsAsRead
