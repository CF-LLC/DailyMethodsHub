'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { ApiResponse } from '@/types'
import { Database } from '@/types/supabase'

type Method = Database['public']['Tables']['methods']['Row']
type CreateMethodInput = Omit<Database['public']['Tables']['methods']['Insert'], 'id' | 'created_at' | 'updated_at'>
type UpdateMethodInput = Partial<CreateMethodInput> & { id: string }

// Helper to convert snake_case to camelCase for response
function convertMethod(method: Method) {
  return {
    id: method.id,
    title: method.title,
    description: method.description,
    category: method.category,
    earnings: method.earnings,
    difficulty: method.difficulty,
    timeRequired: method.time_required,
    link: method.link,
    referralCode: method.referral_code,
    iconUrl: method.icon_url,
    isActive: method.is_active,
    isPublic: method.is_public,
    createdAt: new Date(method.created_at),
    updatedAt: new Date(method.updated_at),
  }
}

export async function getMethods(): Promise<ApiResponse<any[]>> {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }
    
    const { data, error } = await supabase
      .from('methods')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching methods:', error)
      return {
        success: false,
        error: 'Failed to fetch methods',
      }
    }

    const methods = data.map(convertMethod)

    return {
      success: true,
      data: methods,
    }
  } catch (error) {
    console.error('Error fetching methods:', error)
    return {
      success: false,
      error: 'Failed to fetch methods',
    }
  }
}

export async function getMethodById(id: string): Promise<ApiResponse<any>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('methods')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return {
        success: false,
        error: 'Method not found',
      }
    }

    return {
      success: true,
      data: convertMethod(data),
    }
  } catch (error) {
    console.error('Error fetching method:', error)
    return {
      success: false,
      error: 'Failed to fetch method',
    }
  }
}

export async function createMethod(
  input: any
): Promise<ApiResponse<any>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Check if user can post public methods
    if (input.isPublic) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type, status')
        .eq('user_id', user.id)
        .single()

      const isAdmin = profile?.is_admin ?? false
      const isPremium = subscription?.plan_type === 'premium' && subscription?.status === 'active'

      if (!isAdmin && !isPremium) {
        return {
          success: false,
          error: 'Upgrade your account to post public methods',
        }
      }
    }

    const insertData: Database['public']['Tables']['methods']['Insert'] = {
      user_id: user.id,
      title: input.title,
      description: input.description,
      category: input.category,
      earnings: input.earnings,
      difficulty: input.difficulty as 'Easy' | 'Medium' | 'Hard',
      time_required: input.timeRequired,
      link: input.link || null,
      referral_code: input.referralCode || null,
      icon_url: input.iconUrl || null,
      is_active: input.isActive ?? true,
      is_public: input.isPublic ?? false,
    }

    const { data, error } = await (supabase
      .from('methods') as any)
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating method:', error)
      return {
        success: false,
        error: error.message || 'Failed to create method',
      }
    }

    revalidatePath('/methods')
    revalidatePath('/dashboard')
    revalidatePath('/referral-hub')

    return {
      success: true,
      data: convertMethod(data),
      message: 'Method created successfully',
    }
  } catch (error: any) {
    console.error('Error creating method:', error)
    if (error.message?.includes('Forbidden')) {
      return {
        success: false,
        error: 'Admin access required',
      }
    }
    return {
      success: false,
      error: 'Failed to create method',
    }
  }
}

export async function updateMethod(
  input: UpdateMethodInput
): Promise<ApiResponse<any>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Check if user can post public methods
    if (input.isPublic) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan_type, status')
        .eq('user_id', user.id)
        .single()

      const isAdmin = profile?.is_admin ?? false
      const isPremium = subscription?.plan_type === 'premium' && subscription?.status === 'active'

      if (!isAdmin && !isPremium) {
        return {
          success: false,
          error: 'Upgrade your account to post public methods',
        }
      }
    }

    const { id, ...updates } = input as any

    const updateData: any = {}
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.earnings !== undefined) updateData.earnings = updates.earnings
    if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty
    if (updates.timeRequired !== undefined) updateData.time_required = updates.timeRequired
    if (updates.link !== undefined) updateData.link = updates.link
    if (updates.referralCode !== undefined) updateData.referral_code = updates.referralCode
    if (updates.iconUrl !== undefined) updateData.icon_url = updates.iconUrl
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive
    if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic

    const { data, error } = await (supabase
      .from('methods') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      return {
        success: false,
        error: 'Method not found or failed to update',
      }
    }

    revalidatePath('/methods')
    revalidatePath('/dashboard')
    revalidatePath('/referral-hub')

    return {
      success: true,
      data: convertMethod(data),
      message: 'Method updated successfully',
    }
  } catch (error: any) {
    console.error('Error updating method:', error)
    if (error.message?.includes('Forbidden')) {
      return {
        success: false,
        error: 'Admin access required',
      }
    }
    return {
      success: false,
      error: 'Failed to update method',
    }
  }
}

export async function deleteMethod(id: string): Promise<ApiResponse<boolean>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Delete only if the method belongs to the user
    const { error } = await supabase
      .from('methods')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete method',
      }
    }

    revalidatePath('/methods')
    revalidatePath('/dashboard')
    revalidatePath('/referral-hub')

    return {
      success: true,
      data: true,
      message: 'Method deleted successfully',
    }
  } catch (error: any) {
    console.error('Error deleting method:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete method',
    }
  }
}

export async function getActiveMethods(): Promise<ApiResponse<any[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('methods')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching active methods:', error)
      return {
        success: false,
        error: 'Failed to fetch active methods',
      }
    }

    const methods = data.map(convertMethod)

    return {
      success: true,
      data: methods,
    }
  } catch (error) {
    console.error('Error fetching active methods:', error)
    return {
      success: false,
      error: 'Failed to fetch active methods',
    }
  }
}

export async function getMethodsByCategory(
  category: string
): Promise<ApiResponse<any[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('methods')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching methods by category:', error)
      return {
        success: false,
        error: 'Failed to fetch methods',
      }
    }

    const methods = data.map(convertMethod)

    return {
      success: true,
      data: methods,
    }
  } catch (error) {
    console.error('Error fetching methods by category:', error)
    return {
      success: false,
      error: 'Failed to fetch methods',
    }
  }
}

export async function duplicateMethod(id: string): Promise<ApiResponse<any>> {
  try {
    // Require admin access
    await requireAdmin()

    const supabase = await createClient()

    // Get the original method
    const { data: original, error: fetchError } = await (supabase
      .from('methods') as any)
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !original) {
      return {
        success: false,
        error: 'Method not found',
      }
    }

    // Create duplicate with modified title
    const { data, error } = await (supabase
      .from('methods') as any)
      .insert({
        title: `${original.title} (Copy)`,
        description: original.description,
        category: original.category,
        earnings: original.earnings,
        difficulty: original.difficulty,
        time_required: original.time_required,
        link: original.link,
        icon_url: original.icon_url,
        is_active: false, // Set duplicates as inactive by default
      })
      .select()
      .single()

    if (error) {
      console.error('Error duplicating method:', error)
      return {
        success: false,
        error: 'Failed to duplicate method',
      }
    }

    revalidatePath('/methods')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: convertMethod(data),
      message: 'Method duplicated successfully',
    }
  } catch (error: any) {
    console.error('Error duplicating method:', error)
    if (error.message?.includes('Forbidden')) {
      return {
        success: false,
        error: 'Admin access required',
      }
    }
    return {
      success: false,
      error: 'Failed to duplicate method',
    }
  }
}

export async function getMethodStats(): Promise<ApiResponse<any>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Get total count for this user
    const { count: totalCount } = await (supabase
      .from('methods') as any)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get active count for this user
    const { count: activeCount } = await (supabase
      .from('methods') as any)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true)

    // Get methods added this month for this user
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: thisMonthMethods } = await (supabase
      .from('methods') as any)
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString())

    // Get methods by category for this user
    const { data: allMethods } = await (supabase
      .from('methods') as any)
      .select('category')
      .eq('user_id', user.id)

    const categoryCount: Record<string, number> = {}
    allMethods?.forEach((method: any) => {
      categoryCount[method.category] = (categoryCount[method.category] || 0) + 1
    })

    return {
      success: true,
      data: {
        totalCount: totalCount || 0,
        activeCount: activeCount || 0,
        inactiveCount: (totalCount || 0) - (activeCount || 0),
        thisMonthCount: thisMonthMethods?.length || 0,
        categoryBreakdown: categoryCount,
      },
    }
  } catch (error) {
    console.error('Error fetching method stats:', error)
    return {
      success: false,
      error: 'Failed to fetch statistics',
    }
  }
}
