'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ApiResponse } from '@/types'
import { Database } from '@/types/supabase'

type Method = Database['public']['Tables']['methods']['Row']

// Get all public methods (for explore page)
export async function getPublicMethods(): Promise<ApiResponse<any[]>> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('methods')
      .select(`
        *,
        profiles:user_id (
          email
        )
      `)
      .eq('is_public', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching public methods:', error)
      return {
        success: false,
        error: 'Failed to fetch public methods',
      }
    }

    const methods = (data as any[]).map((method: any) => ({
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
      userId: method.user_id,
      userEmail: method.profiles?.email || 'Unknown',
      createdAt: new Date(method.created_at),
      updatedAt: new Date(method.updated_at),
    }))

    return {
      success: true,
      data: methods,
    }
  } catch (error) {
    console.error('Error fetching public methods:', error)
    return {
      success: false,
      error: 'Failed to fetch public methods',
    }
  }
}

// Copy a method from explore to user's methods
export async function copyMethodToMyMethods(methodId: string): Promise<ApiResponse<any>> {
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

    // Get the original method
    const { data: originalMethod, error: fetchError } = await supabase
      .from('methods')
      .select('*')
      .eq('id', methodId)
      .single()

    if (fetchError || !originalMethod) {
      return {
        success: false,
        error: 'Method not found',
      }
    }

    // Type assertion for originalMethod
    const method = originalMethod as Method

    // Check for duplicates (same link without referral code)
    const baseUrl = method.link ? method.link.split('?')[0] : null
    
    if (baseUrl) {
      const { data: existingMethods } = await supabase
        .from('methods')
        .select('link')
        .eq('user_id', user.id)

      if (existingMethods) {
        // Type assertion for existingMethods
        const methods = existingMethods as { link: string | null }[]
        const hasDuplicate = methods.some(m => 
          m.link && m.link.split('?')[0] === baseUrl
        )
        
        if (hasDuplicate) {
          return {
            success: false,
            error: 'You already have this method (or a similar one)',
          }
        }
      }
    }

    // Create a copy for the user
    const insertData: Database['public']['Tables']['methods']['Insert'] = {
      user_id: user.id,
      title: method.title,
      description: method.description,
      category: method.category,
      earnings: method.earnings,
      difficulty: method.difficulty,
      time_required: method.time_required,
      link: method.link,
      referral_code: method.referral_code,
      icon_url: method.icon_url,
      is_active: true,
      is_public: false, // User's copy is private by default
    }

    const { data: newMethod, error: createError } = await supabase
      .from('methods')
      .insert(insertData as any)
      .select()
      .single()

    if (createError) {
      console.error('Error copying method:', createError)
      return {
        success: false,
        error: 'Failed to copy method',
      }
    }

    revalidatePath('/methods')
    revalidatePath('/explore')

    return {
      success: true,
      data: newMethod,
      message: 'Method added to your list!',
    }
  } catch (error) {
    console.error('Error copying method:', error)
    return {
      success: false,
      error: 'Failed to copy method',
    }
  }
}
