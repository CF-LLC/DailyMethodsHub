'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ApiResponse } from '@/types'
import { updateStreakForUser } from './streaks'
import { awardPointsForEarning } from './referrals'

// Types
export interface DailyEarning {
  id: string
  userId: string
  methodId: string
  amount: number
  notes: string | null
  entryDate: string
  createdAt: Date
  updatedAt: Date
  method?: {
    id: string
    title: string
    category: string
    iconUrl: string | null
  }
}

export interface CreateEarningInput {
  methodId: string
  amount: number
  entryDate: string
  notes?: string
}

export interface UpdateEarningInput extends CreateEarningInput {
  id: string
}

export interface EarningsSummary {
  totalLifetime: number
  totalYearly: number
  totalMonthly: number
  totalDaily: number
  dailyAverage: number
  bestDay: { date: string; amount: number } | null
  currentStreak: number
  totalEntries: number
}

export interface AnalyticsData {
  summary: EarningsSummary
  byMethod: Array<{ methodId: string; methodTitle: string; total: number; count: number }>
  byCategory: Array<{ category: string; total: number; count: number }>
  last30Days: Array<{ date: string; amount: number }>
  amountDistribution: Array<{ range: string; count: number }>
}

// Helper to convert snake_case to camelCase
function convertEarning(earning: any): DailyEarning {
  return {
    id: earning.id,
    userId: earning.user_id,
    methodId: earning.method_id,
    amount: parseFloat(earning.amount),
    notes: earning.notes,
    entryDate: earning.entry_date,
    createdAt: new Date(earning.created_at),
    updatedAt: new Date(earning.updated_at),
    method: earning.methods ? {
      id: earning.methods.id,
      title: earning.methods.title,
      category: earning.methods.category,
      iconUrl: earning.methods.icon_url,
    } : undefined,
  }
}

// Get all earnings for current user
export async function getUserEarnings(): Promise<ApiResponse<DailyEarning[]>> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { data, error } = await (supabase
      .from('daily_earnings') as any)
      .select(`
        *,
        methods (
          id,
          title,
          category,
          icon_url
        )
      `)
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (error) {
      console.error('Error fetching earnings:', error)
      return {
        success: false,
        error: 'Failed to fetch earnings',
      }
    }

    const earnings = data.map(convertEarning)

    return {
      success: true,
      data: earnings,
    }
  } catch (error) {
    console.error('Error in getUserEarnings:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Get earnings by date range
export async function getEarningsByDateRange(
  startDate: string,
  endDate: string
): Promise<ApiResponse<DailyEarning[]>> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { data, error } = await (supabase
      .from('daily_earnings') as any)
      .select(`
        *,
        methods (
          id,
          title,
          category,
          icon_url
        )
      `)
      .eq('user_id', user.id)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .order('entry_date', { ascending: false })

    if (error) {
      console.error('Error fetching earnings by date range:', error)
      return {
        success: false,
        error: 'Failed to fetch earnings',
      }
    }

    const earnings = data.map(convertEarning)

    return {
      success: true,
      data: earnings,
    }
  } catch (error) {
    console.error('Error in getEarningsByDateRange:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Get earnings summary
export async function getEarningsSummary(): Promise<ApiResponse<EarningsSummary>> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { data, error } = await (supabase
      .from('daily_earnings') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (error) {
      console.error('Error fetching earnings summary:', error)
      return {
        success: false,
        error: 'Failed to fetch summary',
      }
    }

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const today = now.toISOString().split('T')[0]

    let totalLifetime = 0
    let totalYearly = 0
    let totalMonthly = 0
    let totalDaily = 0
    const dailyTotals: { [key: string]: number } = {}

    data.forEach((entry: any) => {
      const amount = parseFloat(entry.amount)
      const entryDate = new Date(entry.entry_date)
      const dateStr = entry.entry_date

      totalLifetime += amount

      if (entryDate.getFullYear() === currentYear) {
        totalYearly += amount
      }

      if (entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonth) {
        totalMonthly += amount
      }

      if (entry.entry_date === today) {
        totalDaily += amount
      }

      dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + amount
    })

    // Calculate daily average
    const uniqueDays = Object.keys(dailyTotals).length
    const dailyAverage = uniqueDays > 0 ? totalLifetime / uniqueDays : 0

    // Find best day
    let bestDay: { date: string; amount: number } | null = null
    Object.entries(dailyTotals).forEach(([date, amount]) => {
      if (!bestDay || amount > bestDay.amount) {
        bestDay = { date, amount }
      }
    })

    // Calculate streak
    const sortedDates = Object.keys(dailyTotals).sort().reverse()
    let currentStreak = 0
    const todayDate = new Date()
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(sortedDates[i])
      const expectedDate = new Date(todayDate)
      expectedDate.setDate(todayDate.getDate() - i)
      
      if (checkDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
        currentStreak++
      } else {
        break
      }
    }

    const summary: EarningsSummary = {
      totalLifetime,
      totalYearly,
      totalMonthly,
      totalDaily,
      dailyAverage,
      bestDay,
      currentStreak,
      totalEntries: data.length,
    }

    return {
      success: true,
      data: summary,
    }
  } catch (error) {
    console.error('Error in getEarningsSummary:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Create earning entry
export async function createEarningEntry(
  input: CreateEarningInput
): Promise<ApiResponse<DailyEarning>> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { data, error } = await (supabase
      .from('daily_earnings') as any)
      .insert({
        user_id: user.id,
        method_id: input.methodId,
        amount: input.amount,
        entry_date: input.entryDate,
        notes: input.notes || null,
      })
      .select(`
        *,
        methods (
          id,
          title,
          category,
          icon_url
        )
      `)
      .single()

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          error: 'You already have an entry for this method on this date',
        }
      }
      console.error('Error creating earning entry:', error)
      return {
        success: false,
        error: 'Failed to create entry',
      }
    }

    revalidatePath('/earnings')
    revalidatePath('/earnings/analytics')

    return {
      success: true,
      data: convertEarning(data),
      message: 'Entry created successfully',
    }
  } catch (error) {
    console.error('Error in createEarningEntry:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Update earning entry
export async function updateEarningEntry(
  input: UpdateEarningInput
): Promise<ApiResponse<DailyEarning>> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { data, error } = await (supabase
      .from('daily_earnings') as any)
      .update({
        method_id: input.methodId,
        amount: input.amount,
        entry_date: input.entryDate,
        notes: input.notes || null,
      })
      .eq('id', input.id)
      .eq('user_id', user.id)
      .select(`
        *,
        methods (
          id,
          title,
          category,
          icon_url
        )
      `)
      .single()

    if (error) {
      console.error('Error updating earning entry:', error)
      return {
        success: false,
        error: 'Failed to update entry',
      }
    }

    if (!data) {
      return {
        success: false,
        error: 'Entry not found',
      }
    }

    revalidatePath('/earnings')
    revalidatePath('/earnings/analytics')

    return {
      success: true,
      data: convertEarning(data),
      message: 'Entry updated successfully',
    }
  } catch (error) {
    console.error('Error in updateEarningEntry:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Delete earning entry
export async function deleteEarningEntry(id: string): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { error } = await (supabase
      .from('daily_earnings') as any)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting earning entry:', error)
      return {
        success: false,
        error: 'Failed to delete entry',
      }
    }

    revalidatePath('/earnings')
    revalidatePath('/earnings/analytics')

    return {
      success: true,
      message: 'Entry deleted successfully',
    }
  } catch (error) {
    console.error('Error in deleteEarningEntry:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Get analytics data
export async function getAnalyticsData(): Promise<ApiResponse<AnalyticsData>> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { data, error } = await (supabase
      .from('daily_earnings') as any)
      .select(`
        *,
        methods (
          id,
          title,
          category
        )
      `)
      .eq('user_id', user.id)
      .order('entry_date', { ascending: true })

    if (error) {
      console.error('Error fetching analytics data:', error)
      return {
        success: false,
        error: 'Failed to fetch analytics',
      }
    }

    // Get summary
    const summaryResult = await getEarningsSummary()
    const summary = summaryResult.success ? summaryResult.data! : {
      totalLifetime: 0,
      totalYearly: 0,
      totalMonthly: 0,
      totalDaily: 0,
      dailyAverage: 0,
      bestDay: null,
      currentStreak: 0,
      totalEntries: 0,
    }

    // Group by method
    const byMethodMap: { [key: string]: { methodTitle: string; total: number; count: number } } = {}
    data.forEach((entry: any) => {
      const methodId = entry.method_id
      const amount = parseFloat(entry.amount)
      const methodTitle = entry.methods?.title || 'Unknown'

      if (!byMethodMap[methodId]) {
        byMethodMap[methodId] = { methodTitle, total: 0, count: 0 }
      }
      byMethodMap[methodId].total += amount
      byMethodMap[methodId].count += 1
    })

    const byMethod = Object.entries(byMethodMap).map(([methodId, data]) => ({
      methodId,
      methodTitle: data.methodTitle,
      total: data.total,
      count: data.count,
    }))

    // Group by category
    const byCategoryMap: { [key: string]: { total: number; count: number } } = {}
    data.forEach((entry: any) => {
      const category = entry.methods?.category || 'other'
      const amount = parseFloat(entry.amount)

      if (!byCategoryMap[category]) {
        byCategoryMap[category] = { total: 0, count: 0 }
      }
      byCategoryMap[category].total += amount
      byCategoryMap[category].count += 1
    })

    const byCategory = Object.entries(byCategoryMap).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
    }))

    // Last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const dailyTotals: { [key: string]: number } = {}
    data.forEach((entry: any) => {
      const entryDate = new Date(entry.entry_date)
      if (entryDate >= thirtyDaysAgo) {
        const dateStr = entry.entry_date
        dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + parseFloat(entry.amount)
      }
    })

    const last30Days = Object.entries(dailyTotals).map(([date, amount]) => ({
      date,
      amount,
    }))

    // Amount distribution
    const ranges = [
      { range: '$0-$10', min: 0, max: 10 },
      { range: '$10-$25', min: 10, max: 25 },
      { range: '$25-$50', min: 25, max: 50 },
      { range: '$50-$100', min: 50, max: 100 },
      { range: '$100+', min: 100, max: Infinity },
    ]

    const distribution = ranges.map(({ range, min, max }) => {
      const count = Object.values(dailyTotals).filter(
        amount => amount >= min && amount < max
      ).length
      return { range, count }
    })

    const analyticsData: AnalyticsData = {
      summary,
      byMethod,
      byCategory,
      last30Days,
      amountDistribution: distribution,
    }

    return {
      success: true,
      data: analyticsData,
    }
  } catch (error) {
    console.error('Error in getAnalyticsData:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
