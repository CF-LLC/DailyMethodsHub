import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { TrendingUp, Shield, Zap } from 'lucide-react'
import { FloatingIcons } from '@/components/FloatingIcons'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Floating crypto and currency icons */}
      <FloatingIcons />
      
      {/* Hero */}
      <main className="relative container mx-auto px-4 py-20 z-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Discover Daily
            <span className="text-primary"> Earning Methods</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Track and manage your income opportunities in one place. From surveys to cashback, find the best ways to earn money online.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup">
              <Button size="lg">Get started for free</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="ghost">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-white/90 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Track Earnings</h3>
            <p className="text-muted-foreground">
              Monitor your daily income opportunities and maximize your earnings potential.
            </p>
          </div>

          <div className="rounded-lg border bg-white/90 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Verified Methods</h3>
            <p className="text-muted-foreground">
              All earning methods are verified and curated by our team for quality.
            </p>
          </div>

          <div className="rounded-lg border bg-white/90 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Easy to Use</h3>
            <p className="text-muted-foreground">
              Simple, intuitive interface designed for quick access to earning opportunities.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
