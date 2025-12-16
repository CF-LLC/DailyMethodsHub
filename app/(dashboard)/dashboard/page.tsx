import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { getMethods, getMethodStats } from '@/app/actions/methods'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Activity,
  Plus,
  BarChart3,
  LayoutDashboard,
  Sparkles,
  Target,
  Zap
} from 'lucide-react'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { MethodsChart } from '@/components/dashboard/MethodsChart'
import { RecentMethods } from '@/components/dashboard/RecentMethods'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard for managing daily earning methods',
}


async function DashboardContent() {
  const [statsResult, methodsResult] = await Promise.all([
    getMethodStats(),
    getMethods(),
  ])

  const stats = statsResult.success ? statsResult.data : null
  const methods = methodsResult.success ? methodsResult.data : []

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <MethodsChart methods={methods || []} />
        <QuickActions />
      </div>

      {/* Recent Methods */}
      <RecentMethods methods={(methods || []).slice(0, 5)} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <>
      <Header 
        title="Dashboard" 
        description="Overview of your earning methods platform" 
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          {/* Hero Header with Gradient */}
          <PageHeader
            title="Dashboard"
            description="Track your earning methods, analyze performance, and discover new opportunities"
            icon={<LayoutDashboard className="h-6 w-6" />}
            gradient={true}
            action={
              <Link href="/methods">
                <Button size="lg" className="shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Method
                </Button>
              </Link>
            }
          />

          <Suspense
            fallback={
              <div className="flex h-[400px] items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <DashboardContent />
          </Suspense>
        </div>
      </main>
    </>
  )
}
