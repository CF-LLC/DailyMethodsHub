'use client'

import { TrendingUp, DollarSign, Calendar, Award } from 'lucide-react'
import { EarningsSummary } from '@/app/actions/earnings'

interface AnalyticsSummaryProps {
  summary: EarningsSummary
}

export default function AnalyticsSummary({ summary }: AnalyticsSummaryProps) {
  const stats = [
    {
      label: 'Lifetime Total',
      value: `$${summary.totalLifetime.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      label: 'Daily Average',
      value: `$${summary.dailyAverage.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Entries',
      value: summary.totalEntries.toString(),
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      label: 'Best Day Ever',
      value: summary.bestDay ? `$${summary.bestDay.amount.toFixed(2)}` : '$0.00',
      icon: Award,
      color: 'bg-orange-500',
      subtitle: summary.bestDay?.date || 'No data',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </h3>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.subtitle}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
