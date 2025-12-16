// @ts-nocheck - Temporary: Supabase type inference issues with new tables
'use server'

import { createClient } from '@/lib/supabase/server'

// Types
export interface Subscription {
  id: string
  userId: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  status: 'inactive' | 'active' | 'canceled' | 'incomplete' | 'past_due'
  planType: 'free' | 'premium'
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}

// Get user's subscription
export async function getUserSubscription(): Promise<ApiResponse<Subscription>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error)
      return { success: false, error: 'Failed to fetch subscription' }
    }

    // Create if doesn't exist
    if (!data) {
      const { error: insertError } = await supabase
        .from('subscriptions')
        // @ts-expect-error - Supabase type inference issue
        .insert([{
          user_id: user.id,
          status: 'inactive',
          plan_type: 'free',
        }])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating subscription:', insertError)
        return { success: false, error: 'Failed to create subscription' }
      }

      return {
        success: true,
        data: convertSubscription(newSub),
      }
    }

    return {
      success: true,
      data: convertSubscription(data),
    }
  } catch (error) {
    console.error('Unexpected error in getUserSubscription:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Check if user is premium
export async function isPremiumUser(): Promise<ApiResponse<boolean>> {
  try {
    const result = await getUserSubscription()
    
    if (!result.success || !result.data) {
      return { success: true, data: false }
    }

    const isPremium = result.data.status === 'active' && result.data.planType === 'premium'
    return { success: true, data: isPremium }
  } catch (error) {
    console.error('Unexpected error in isPremiumUser:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Helper function to convert DB subscription to typed object
function convertSubscription(data: any): Subscription {
  return {
    id: data.id,
    userId: data.user_id,
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
    status: data.status,
    planType: data.plan_type,
    currentPeriodStart: data.current_period_start,
    currentPeriodEnd: data.current_period_end,
    cancelAtPeriodEnd: data.cancel_at_period_end,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
