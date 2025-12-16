'use client'

import { DollarSign, TrendingUp, Calendar, Zap } from 'lucide-react'
import { EarningsSummary } from '@/app/actions/earnings'

interface SummaryCardsProps {
  summary: EarningsSummary
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Monthly Total',
      value: `$${summary.totalMonthly.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-blue-500',
      description: 'This month',
    },
    {
      title: 'Yearly Total',
      value: `$${summary.totalYearly.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      description: 'This year',
    },
    {
      title: 'Current Streak',
      value: `${summary.currentStreak} days`,
      icon: Zap,
      color: 'bg-orange-500',
      description: 'Consecutive days',
    },
    {
      title: 'Best Day',
      value: summary.bestDay ? `$${summary.bestDay.amount.toFixed(2)}` : '$0.00',
      icon: Calendar,
      color: 'bg-purple-500',
      description: summary.bestDay?.date || 'No entries yet',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </h3>
              <div className={`${card.color} p-2 rounded-lg`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
