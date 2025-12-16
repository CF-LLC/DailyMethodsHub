import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export async function middleware(request: NextRequest) {
  // Update session
  let response = await updateSession(request)

  // Check if accessing admin-only routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/dashboard')
  
  // Check if accessing protected routes (requires authentication)
  const isProtectedRoute = isAdminRoute ||
                          request.nextUrl.pathname.startsWith('/earnings') ||
                          request.nextUrl.pathname.startsWith('/settings') ||
                          request.nextUrl.pathname.startsWith('/referrals')

  if (isProtectedRoute) {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // If no user, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // For admin routes, check if user is admin
    if (isAdminRoute) {
      const { data: profile, error: profileError } = await (supabase
        .from('profiles') as any)
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()

      // If not admin, redirect to earnings
      if (!profile || profileError || !profile.is_admin) {
        return NextResponse.redirect(new URL('/earnings', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
