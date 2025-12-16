// @ts-nocheck - Temporary: Supabase type inference issues with new tables
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getUserStreak, updateStreakForUser } from './streaks'

// Types
export interface ReferralPoints {
  userId: string
  points: number
  lifetimePoints: number
  updatedAt: string
}

export interface Referral {
  id: string
  referrerId: string
  referredUserId: string
  createdAt: string
}

export interface ReferralStats {
  totalReferrals: number
  points: ReferralPoints
  recentReferrals: Referral[]
}

export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}

const POINTS_CONFIG = {
  REFERRAL_SIGNUP: 25,
  DAILY_EARNING: 1,
  STREAK_7_DAYS: 10,
  STREAK_30_DAYS: 50,
  STREAK_100_DAYS: 200,
  MONTHLY_VOLUME_100: 10,
  MONTHLY_VOLUME_500: 30,
  MONTHLY_VOLUME_1000: 75,
}

// Get user's referral points
export async function getUserPoints(): Promise<ApiResponse<ReferralPoints>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('referral_points')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching points:', error)
      return { success: false, error: 'Failed to fetch points' }
    }

    // Create if doesn't exist
    if (!data) {
      const { data: newPoints, error: insertError } = await supabase
        .from('referral_points')
        // @ts-expect-error - Supabase type inference issue
        .insert([{
          user_id: user.id,
          points: 0,
          lifetime_points: 0,
        }])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating points:', insertError)
        return { success: false, error: 'Failed to create points record' }
      }

      return {
        success: true,
        data: {
          userId: newPoints.user_id,
          points: newPoints.points,
          lifetimePoints: newPoints.lifetime_points,
          updatedAt: newPoints.updated_at,
        },
      }
    }

    return {
      success: true,
      data: {
        userId: data.user_id,
        points: data.points,
        lifetimePoints: data.lifetime_points,
        updatedAt: data.updated_at,
      },
    }
  } catch (error) {
    console.error('Unexpected error in getUserPoints:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Award points (internal function)
async function awardPoints(userId: string, pointsToAdd: number): Promise<ApiResponse> {
  try {
    const supabase = await createClient()

    // Get current points
    const { data: currentPoints } = await supabase
      .from('referral_points')
      .select('*')
      .eq('user_id', userId)
      .single()

    // @ts-expect-error - Supabase type inference issue
    const newPoints = (currentPoints?.points || 0) + pointsToAdd
    // @ts-ignore
    const newLifetimePoints = (currentPoints?.lifetime_points || 0) + pointsToAdd

    if (currentPoints) {
      const { error: updateError } = await supabase
        .from('referral_points')
        // @ts-expect-error - Supabase type inference issue
        .update({
          points: newPoints,
          lifetime_points: newLifetimePoints,
        })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating points:', error)
        return { success: false, error: 'Failed to update points' }
      }
    } else {
      const { error: insertError } = await supabase
        .from('referral_points')
        // @ts-expect-error - Supabase type inference issue
        .insert([{
          user_id: user.id,
          points: pointsToAdd,
          lifetime_points: pointsToAdd,
        }])

      if (error) {
        console.error('Error creating points:', error)
        return { success: false, error: 'Failed to create points' }
      }
    }

    revalidatePath('/referrals')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error in awardPoints:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Award points for daily earning
export async function awardPointsForEarning(amount: number): Promise<ApiResponse> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Base points for logging
    await awardPoints(user.id, POINTS_CONFIG.DAILY_EARNING)

    // Check for streak milestones
    const streakResult = await getUserStreak()
    if (streakResult.success && streakResult.data) {
      const streak = streakResult.data.currentStreak

      if (streak === 7) {
        await awardPoints(user.id, POINTS_CONFIG.STREAK_7_DAYS)
      } else if (streak === 30) {
        await awardPoints(user.id, POINTS_CONFIG.STREAK_30_DAYS)
      } else if (streak === 100) {
        await awardPoints(user.id, POINTS_CONFIG.STREAK_100_DAYS)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in awardPointsForEarning:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Record a referral
export async function recordReferral(referredUserId: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Insert referral record
    const { error } = await supabase
      .from('referrals')
      .insert([{
        referrer_id: user.id,
        referred_user_id: referredUserId,
      }])

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'User already referred' }
      }
      console.error('Error recording referral:', error)
      return { success: false, error: 'Failed to record referral' }
    }

    // Award points to referrer
    await awardPoints(user.id, POINTS_CONFIG.REFERRAL_SIGNUP)

    revalidatePath('/referrals')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error in recordReferral:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get referral stats
export async function getReferralStats(): Promise<ApiResponse<ReferralStats>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get total referrals count
    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id)

    // Get recent referrals
    const { data: referralsData } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    const recentReferrals: Referral[] = (referralsData || []).map((r: any) => ({
      id: r.id,
      referrerId: r.referrer_id,
      referredUserId: r.referred_user_id,
      createdAt: r.created_at,
    }))

    // Get points
    const pointsResult = await getUserPoints()
    const points = pointsResult.data || {
      userId: user.id,
      points: 0,
      lifetimePoints: 0,
      updatedAt: new Date().toISOString(),
    }

    return {
      success: true,
      data: {
        totalReferrals: count || 0,
        points,
        recentReferrals,
      },
    }
  } catch (error) {
    console.error('Unexpected error in getReferralStats:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Generate referral code (simple base64 user ID)
export async function generateReferralCode(): Promise<ApiResponse<string>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const code = Buffer.from(user.id).toString('base64url')
    return { success: true, data: code }
  } catch (error) {
    console.error('Unexpected error in generateReferralCode:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Decode referral code
export async function decodeReferralCode(code: string): Promise<string | null> {
  try {
    return Buffer.from(code, 'base64url').toString('utf-8')
  } catch {
    return null
  }
}
