'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ApiResponse } from '@/types'
import { Database } from '@/types/supabase'

type Method = Database['public']['Tables']['methods']['Row']

// Helper to convert snake_case to camelCase for response
async function convertMethod(method: Method) {
  return {
    id: method.id,
    title: method.title,
    description: method.description,
    category: method.category,
    earnings: method.earnings,
    difficulty: method.difficulty,
    timeRequired: method.time_required,
    link: method.link,
    iconUrl: method.icon_url,
    isActive: method.is_active,
    createdAt: new Date(method.created_at),
    updatedAt: new Date(method.updated_at),
  }
}

// Cache for 60 seconds to improve performance
export const getPublicMethods = cache(async (filters?: {
  category?: string
  search?: string
}): Promise<ApiResponse<any[]>> => {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('methods')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    // Apply category filter
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    // Apply search filter
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching public methods:', error)
      return {
        success: false,
        error: 'Failed to fetch methods',
      }
    }

    const methods = await Promise.all(data.map(convertMethod))

    return {
      success: true,
      data: methods,
    }
  } catch (error) {
    console.error('Error in getPublicMethods:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
})

// Cache individual method lookups
export const getMethodById = cache(async (id: string): Promise<ApiResponse<any>> => {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('methods')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return {
        success: false,
        error: 'Method not found',
      }
    }

    return {
      success: true,
      data: await convertMethod(data),
    }
  } catch (error) {
    console.error('Error in getMethodById:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
})

// Get all unique categories from active methods
export const getCategories = cache(async (): Promise<ApiResponse<string[]>> => {
  try {
    const supabase = await createClient()
    
    const { data, error } = await (supabase
      .from('methods') as any)
      .select('category')
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching categories:', error)
      return {
        success: false,
        error: 'Failed to fetch categories',
      }
    }

    const categories = Array.from(new Set(data.map((m: any) => m.category))) as string[]

    return {
      success: true,
      data: categories,
    }
  } catch (error) {
    console.error('Error in getCategories:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
})
