import { Suspense } from 'react'
import { Metadata } from 'next'
import { getAnalyticsData } from '@/app/actions/earnings'
import AnalyticsSummary from '@/components/earnings/AnalyticsSummary'
import MethodsBreakdown from '@/components/earnings/MethodsBreakdown'
import CategoryBreakdown from '@/components/earnings/CategoryBreakdown'
import AmountDistribution from '@/components/earnings/AmountDistribution'
import TrendChart from '@/components/earnings/TrendChart'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Earnings Analytics | Daily Methods Hub',
  description: 'Detailed analytics and insights about your earnings',
}

async function AnalyticsContent() {
  const result = await getAnalyticsData()
  
  if (!result.success || !result.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Unable to load analytics data
        </p>
      </div>
    )
  }

  const { summary, byMethod, byCategory, last30Days, amountDistribution } = result.data

  // Map amount to total for TrendChart compatibility
  const trendData = last30Days.map(item => ({ date: item.date, total: item.amount }))

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <AnalyticsSummary summary={summary} />

      {/* 30-Day Trend */}
      <TrendChart data={trendData} />

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MethodsBreakdown data={byMethod} />
        <CategoryBreakdown data={byCategory} />
      </div>

      {/* Amount Distribution */}
      <AmountDistribution data={amountDistribution} />
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Earnings Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Detailed insights and trends about your earnings
        </p>
      </div>

      {/* Content */}
      <Suspense fallback={<LoadingSpinner />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  )
}
