'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAvailableTasks() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      success: false,
      error: 'Not authenticated',
    }
  }

  try {
    // Get all active methods for the user
    const { data: methods, error: methodsError } = await supabase
      .from('methods')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (methodsError) throw methodsError

    // Get completions from today
    const today = new Date().toISOString().split('T')[0]
    const { data: completions, error: completionsError } = await supabase
      .from('method_completions')
      .select('method_id, completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', `${today}T00:00:00`)

    if (completionsError) throw completionsError

    // Create a map of method_id -> last completion time
    const completionMap = new Map()
    ;(completions as any[] || []).forEach(c => {
      completionMap.set(c.method_id, new Date(c.completed_at))
    })

    // Calculate time until next available for each method
    const now = new Date()
    const tasksWithStatus = ((methods as any[]) || []).map(method => {
      const lastCompletion = completionMap.get(method.id)
      
      let nextAvailable = null
      let isAvailable = true
      let timeUntilAvailable = 0

      if (lastCompletion) {
        // Parse time_required to get hours (assuming format like "10 min", "1 hour", "24 hours")
        const timeMatch = method.time_required.match(/(\d+)\s*(min|hour|day)/i)
        if (timeMatch) {
          const value = parseInt(timeMatch[1])
          const unit = timeMatch[2].toLowerCase()
          
          let hoursToAdd = 0
          if (unit.startsWith('min')) {
            hoursToAdd = value / 60
          } else if (unit.startsWith('hour')) {
            hoursToAdd = value
          } else if (unit.startsWith('day')) {
            hoursToAdd = value * 24
          }

          nextAvailable = new Date(lastCompletion.getTime() + hoursToAdd * 60 * 60 * 1000)
          isAvailable = now >= nextAvailable
          timeUntilAvailable = Math.max(0, nextAvailable.getTime() - now.getTime())
        }
      }

      // Parse earnings for sorting (extract first number)
      const earningsMatch = method.earnings.match(/\d+/)
      const earningsValue = earningsMatch ? parseInt(earningsMatch[0]) : 0

      return {
        ...method,
        isAvailable,
        nextAvailable,
        timeUntilAvailable,
        earningsValue,
        lastCompleted: lastCompletion,
      }
    })

    // Sort: available first (by time required, then earnings), then unavailable (by time until available)
    const sorted = tasksWithStatus.sort((a, b) => {
      // Available tasks first
      if (a.isAvailable && !b.isAvailable) return -1
      if (!a.isAvailable && b.isAvailable) return 1

      if (a.isAvailable && b.isAvailable) {
        // Both available: sort by time_required (shortest first), then earnings (highest first)
        const timeA = parseTimeToMinutes(a.time_required)
        const timeB = parseTimeToMinutes(b.time_required)
        
        if (timeA !== timeB) return timeA - timeB
        return b.earningsValue - a.earningsValue
      }

      // Both unavailable: sort by time until available (soonest first)
      return a.timeUntilAvailable - b.timeUntilAvailable
    })

    return {
      success: true,
      data: sorted,
    }
  } catch (error: any) {
    console.error('Error fetching available tasks:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+)\s*(min|hour|day)/i)
  if (!match) return 0
  
  const value = parseInt(match[1])
  const unit = match[2].toLowerCase()
  
  if (unit.startsWith('min')) return value
  if (unit.startsWith('hour')) return value * 60
  if (unit.startsWith('day')) return value * 24 * 60
  
  return 0
}

export async function completeTask(methodId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      success: false,
      error: 'Not authenticated',
    }
  }

  try {
    const { data, error } = await supabase
      .from('method_completions')
      .insert({
        user_id: user.id,
        method_id: methodId,
      } as any)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/methods')

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error('Error completing task:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}
