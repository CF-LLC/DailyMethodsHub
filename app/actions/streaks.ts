// @ts-nocheck - Temporary: Supabase type inference issues with new tables
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Types
export interface Streak {
  userId: string
  currentStreak: number
  longestStreak: number
  lastEntryDate: string | null
  updatedAt: string
}

export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}

// Get user's streak data
export async function getUserStreak(): Promise<ApiResponse<Streak>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching streak:', error)
      return { success: false, error: 'Failed to fetch streak data' }
    }

    // If no streak record exists, create one
    if (!data) {
      const { data: newStreak, error: insertError } = await supabase
        .from('streaks')
        // @ts-expect-error - Supabase type inference issue
        .insert([{
          user_id: user.id,
          current_streak: 0,
          longest_streak: 0,
          last_entry_date: null,
        }])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating streak:', insertError)
        return { success: false, error: 'Failed to create streak record' }
      }

      return {
        success: true,
        data: {
          userId: newStreak.user_id,
          currentStreak: newStreak.current_streak,
          longestStreak: newStreak.longest_streak,
          lastEntryDate: newStreak.last_entry_date,
          updatedAt: newStreak.updated_at,
        },
      }
    }

    return {
      success: true,
      data: {
        userId: data.user_id,
        currentStreak: data.current_streak,
        longestStreak: data.longest_streak,
        lastEntryDate: data.last_entry_date,
        updatedAt: data.updated_at,
      },
    }
  } catch (error) {
    console.error('Unexpected error in getUserStreak:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Update streak when a new earning is logged
export async function updateStreakForUser(entryDate: string): Promise<ApiResponse<Streak>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get current streak
    const currentStreakResult = await getUserStreak()
    if (!currentStreakResult.success || !currentStreakResult.data) {
      return { success: false, error: 'Failed to get current streak' }
    }

    const streak = currentStreakResult.data
    const entryDateObj = new Date(entryDate)
    const lastEntryDateObj = streak.lastEntryDate ? new Date(streak.lastEntryDate) : null

    let newCurrentStreak = 1
    let newLongestStreak = streak.longestStreak

    if (lastEntryDateObj) {
      // Calculate days difference
      const diffTime = entryDateObj.getTime() - lastEntryDateObj.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day - no change
        return { success: true, data: streak }
      } else if (diffDays === 1) {
        // Consecutive day - increment streak
        newCurrentStreak = streak.currentStreak + 1
      } else {
        // Streak broken - reset to 1
        newCurrentStreak = 1
      }
    }

    // Update longest streak if current is higher
    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak
    }

    // Update in database
    const { data: updatedStreak, error: updateError } = await supabase
      .from('streaks')
      // @ts-expect-error - Supabase type inference issue
      .update({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_entry_date: entryDate,
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating streak:', error)
      return { success: false, error: 'Failed to update streak' }
    }

    revalidatePath('/earnings')

    return {
      success: true,
      data: {
        userId: updatedStreak.user_id,
        currentStreak: updatedStreak.current_streak,
        longestStreak: updatedStreak.longest_streak,
        lastEntryDate: updatedStreak.last_entry_date,
        updatedAt: updatedStreak.updated_at,
      },
    }
  } catch (error) {
    console.error('Unexpected error in updateStreakForUser:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Check if user needs a streak reminder (last entry was 2+ days ago)
export async function checkStreakStatus(): Promise<ApiResponse<{ needsReminder: boolean; daysMissed: number }>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const streakResult = await getUserStreak()
    if (!streakResult.success || !streakResult.data) {
      return { success: false, error: 'Failed to get streak data' }
    }

    const streak = streakResult.data
    if (!streak.lastEntryDate) {
      return { success: true, data: { needsReminder: true, daysMissed: 0 } }
    }

    const today = new Date()
    const lastEntry = new Date(streak.lastEntryDate)
    const diffTime = today.getTime() - lastEntry.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    return {
      success: true,
      data: {
        needsReminder: diffDays >= 2,
        daysMissed: diffDays,
      },
    }
  } catch (error) {
    console.error('Unexpected error in checkStreakStatus:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
