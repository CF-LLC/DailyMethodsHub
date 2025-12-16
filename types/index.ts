import { Database } from './supabase'

// Use Supabase-generated types directly
export type Method = Database['public']['Tables']['methods']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

// Custom input types for forms/API (using camelCase for convenience)
// These will be converted to snake_case when inserting into database
export interface CreateMethodInput {
  title: string
  description: string
  category: string
  earnings: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeRequired: string
  link?: string
  iconUrl?: string
  isActive?: boolean
}

export interface UpdateMethodInput extends Partial<CreateMethodInput> {
  id: string
}

export type MethodCategory = 
  | 'Survey'
  | 'Cashback'
  | 'Task'
  | 'Referral'
  | 'Investment'
  | 'Other'

export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  createdAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthUser {
  id: string
  email: string
  isAdmin: boolean
}
