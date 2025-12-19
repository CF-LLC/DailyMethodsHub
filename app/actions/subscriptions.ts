'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserSubscription() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    // If no subscription exists, create a free one
    if (!data) {
      // @ts-ignore - Supabase type generation issue with insert
      const { data: newSub, error: createError } = await supabase
        .from('subscriptions')
        // @ts-ignore
        .insert({
          user_id: user.id,
          status: 'active',
          plan_type: 'free',
          payment_method: 'none',
        })
        .select()
        .single()

      if (createError) throw createError

      return {
        success: true,
        data: newSub,
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error('Error fetching subscription:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function isPremiumUser(): Promise<boolean> {
  const result: any = await getUserSubscription()
  
  if (!result.success || !result.data) {
    return false
  }

  return result.data.plan_type === 'premium' && result.data.status === 'active'
}

export async function verifyBitcoinPayment(userEmail: string, txId: string, address: string, amountSats: number) {
  try {
    const supabase = await createClient()
    
    // Find the user by email (the customer, not the admin)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (profileError || !profile) {
      return {
        success: false,
        error: 'User not found with that email',
      }
    }

    // @ts-ignore - Supabase type generation issue with update
    const { data, error } = await supabase
      .from('subscriptions')
      .update(
        // @ts-ignore
        {
          status: 'active',
          plan_type: 'premium',
          payment_method: 'bitcoin',
          payment_tx_id: txId,
          payment_address: address,
          payment_amount_sats: amountSats,
          payment_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      )
      .eq('user_id', profile.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/settings')

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function verifyLightningPayment(userEmail: string, invoice: string, paymentHash: string) {
  try {
    const supabase = await createClient()
    
    // Find the user by email (the customer, not the admin)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (profileError || !profile) {
      return {
        success: false,
        error: 'User not found with that email',
      }
    }

    // @ts-ignore - Supabase type generation issue with update
    const { data, error } = await supabase
      .from('subscriptions')
      .update(
        // @ts-ignore
        {
          status: 'active',
          plan_type: 'premium',
          payment_method: 'lightning',
          payment_tx_id: paymentHash,
          lightning_invoice: invoice,
          payment_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      )
      .eq('user_id', profile.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard')
    revalidatePath('/settings')

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error('Error verifying Lightning payment:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}
