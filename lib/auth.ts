import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import { AuthUser } from '@/types'

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Fetch profile to check admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email!,
    isAdmin: profile?.is_admin ?? false,
  }
})

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.isAdmin ?? false
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (!user.isAdmin) {
    throw new Error('Forbidden: Admin access required')
  }
  return user
}
