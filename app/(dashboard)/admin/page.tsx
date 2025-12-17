import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { getMethods, getMethodStats } from '@/app/actions/methods'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Plus, Shield } from 'lucide-react'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { RecentMethods } from '@/components/dashboard/RecentMethods'
import { QuickActions } from '@/components/dashboard/QuickActions'
import ManualVerificationForm from '@/components/ManualVerificationForm'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin-only dashboard for managing all methods',
}

async function AdminDashboardContent() {
  const [statsResult, methodsResult] = await Promise.all([
    getMethodStats(),
    getMethods(),
  ])

  const stats = statsResult.success ? statsResult.data : null
  const methods = methodsResult.success ? methodsResult.data : []

  return (
    <div className="space-y-8">
      {/* Admin Badge */}
      <div className="flex items-center gap-2 text-amber-600">
        <Shield className="h-5 w-5" />
        <span className="font-semibold">Admin Dashboard</span>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Payment Verification */}
      <ManualVerificationForm />

      {/* All Methods */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">All Methods</h2>
          <Link href="/methods?action=new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </Link>
        </div>
        <RecentMethods methods={methods || []} />
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <div className="flex h-[400px] items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <AdminDashboardContent />
      </Suspense>
    </main>
  )
}
