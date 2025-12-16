'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Activity, TrendingUp, XCircle, CheckCircle, TrendingDown, Minus } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalCount: number
    activeCount: number
    inactiveCount: number
    thisMonthCount: number
    categoryBreakdown: Record<string, number>
  } | null
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const activePercentage = stats.totalCount > 0 
    ? Math.round((stats.activeCount / stats.totalCount) * 100) 
    : 0

  const statCards = [
    {
      title: 'Total Methods',
      value: stats.totalCount,
      icon: Activity,
      description: 'All earning methods',
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      trend: stats.thisMonthCount > 0 ? '+' + stats.thisMonthCount : '0',
      trendIcon: stats.thisMonthCount > 0 ? TrendingUp : Minus,
      trendColor: stats.thisMonthCount > 0 ? 'text-green-600' : 'text-gray-400',
    },
    {
      title: 'Active Methods',
      value: stats.activeCount,
      icon: CheckCircle,
      description: `${activePercentage}% of total`,
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-green-100/50',
      trend: activePercentage + '%',
      trendIcon: activePercentage > 75 ? TrendingUp : activePercentage > 50 ? Minus : TrendingDown,
      trendColor: activePercentage > 75 ? 'text-green-600' : activePercentage > 50 ? 'text-yellow-600' : 'text-red-600',
    },
    {
      title: 'Added This Month',
      value: stats.thisMonthCount,
      icon: TrendingUp,
      description: 'New opportunities',
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100/50',
      trend: stats.thisMonthCount > 0 ? 'Growing' : 'No growth',
      trendIcon: stats.thisMonthCount > 0 ? TrendingUp : Minus,
      trendColor: stats.thisMonthCount > 0 ? 'text-green-600' : 'text-gray-400',
    },
    {
      title: 'Categories',
      value: Object.keys(stats.categoryBreakdown).length,
      icon: XCircle,
      description: 'Diversified income',
      color: 'text-orange-600',
      bgGradient: 'from-orange-50 to-orange-100/50',
      trend: Object.keys(stats.categoryBreakdown).length + ' types',
      trendIcon: Minus,
      trendColor: 'text-gray-400',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            <div className="flex items-center gap-1 mt-2">
              <stat.trendIcon className={`h-3 w-3 ${stat.trendColor}`} />
              <span className={`text-xs font-medium ${stat.trendColor}`}>
                {stat.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
