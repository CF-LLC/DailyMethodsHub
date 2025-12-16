import { Suspense } from 'react'
import { Metadata } from 'next'
import { Plus } from 'lucide-react'
import { getEarningsSummary, getUserEarnings } from '@/app/actions/earnings'
import { getUserStreak } from '@/app/actions/streaks'
import SummaryCards from '@/components/earnings/SummaryCards'
import EarningsChart from '@/components/earnings/EarningsChart'
import EarningsTable from '@/components/earnings/EarningsTable'
import AddEarningButton from '@/components/earnings/AddEarningButton'
import StreakBadge from '@/components/streaks/StreakBadge'
import CSVExportButton from '@/components/earnings/CSVExportButton'
import CSVImportButton from '@/components/earnings/CSVImportButton'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'My Earnings | Daily Methods Hub',
  description: 'Track and manage your daily earnings from various methods',
}

async function EarningsSummarySection() {
  const result = await getEarningsSummary()
  
  if (!result.success || !result.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Unable to load earnings summary
        </p>
      </div>
    )
  }

  return <SummaryCards summary={result.data} />
}

async function StreakSection() {
  const result = await getUserStreak()
  
  if (!result.success || !result.data) {
    return null
  }

  return <StreakBadge streak={result.data} />
}

async function EarningsChartSection() {
  const result = await getUserEarnings()
  
  if (!result.success || !result.data) {
    return null
  }

  // Group earnings by date and sum amounts
  const earningsByDate = result.data.reduce((acc: Record<string, number>, earning) => {
    const date = earning.entryDate
    acc[date] = (acc[date] || 0) + earning.amount
    return acc
  }, {})

  // Get last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toISOString().split('T')[0]
    return {
      date: dateStr,
      amount: earningsByDate[dateStr] || 0,
    }
  })

  return <EarningsChart data={last30Days} />
}

async function EarningsHistorySection() {
  const result = await getUserEarnings()
  
  if (!result.success || !result.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Unable to load earnings history
        </p>
      </div>
    )
  }

  return <EarningsTable earnings={result.data} />
}

export default function EarningsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My Earnings
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your daily earnings and analyze your income
          </p>
        </div>
        <div className="flex gap-2">
          <CSVExportButton />
          <CSVImportButton />
          <AddEarningButton />
        </div>
      </div>

      {/* Summary Cards */}
      <Suspense fallback={<LoadingSpinner />}>
        <EarningsSummarySection />
      </Suspense>

      {/* Streak Badge */}
      <Suspense fallback={<LoadingSpinner />}>
        <StreakSection />
      </Suspense>

      {/* Chart */}
      <Suspense fallback={<LoadingSpinner />}>
        <EarningsChartSection />
      </Suspense>

      {/* Recent Earnings Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Earnings
        </h2>
        <Suspense fallback={<LoadingSpinner />}>
          <EarningsHistorySection />
        </Suspense>
      </div>
    </div>
  )
}

