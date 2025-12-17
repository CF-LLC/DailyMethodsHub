import { Suspense } from 'react'
import { Metadata } from 'next'
import { getMethods, getMethodStats } from '@/app/actions/methods'
import { getAvailableTasks } from '@/app/actions/tasks'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { AvailableTasks } from '@/components/dashboard/AvailableTasks'
import { RecentMethods } from '@/components/dashboard/RecentMethods'
import { QuickActions } from '@/components/dashboard/QuickActions'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard for managing daily earning methods',
}


async function DashboardContent() {
  const [statsResult, methodsResult, tasksResult] = await Promise.all([
    getMethodStats(),
    getMethods(),
    getAvailableTasks(),
  ])

  const stats = statsResult.success ? statsResult.data : null
  const methods = methodsResult.success ? methodsResult.data : []
  const tasks = tasksResult.success ? tasksResult.data : []

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Available Tasks and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <AvailableTasks tasks={tasks || []} />
        <QuickActions />
      </div>

      {/* Recent Methods */}
      <RecentMethods methods={(methods || []).slice(0, 5)} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <div className="flex h-[400px] items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </main>
  )
}
