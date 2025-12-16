'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BarChart3, TrendingUp } from 'lucide-react'

interface MethodsChartProps {
  methods: any[]
}

export function MethodsChart({ methods }: MethodsChartProps) {
  // Group methods by month
  const monthlyData = methods.reduce((acc: any, method) => {
    const date = new Date(method.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    acc[monthKey] = (acc[monthKey] || 0) + 1
    return acc
  }, {})

  const sortedMonths = Object.keys(monthlyData).sort().slice(-6)
  const maxCount = Math.max(...Object.values(monthlyData) as number[], 1)
  const totalAdded = sortedMonths.reduce((sum, month) => sum + monthlyData[month], 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <CardTitle>Growth Tracking</CardTitle>
          </div>
          {totalAdded > 0 && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">{totalAdded} added</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Methods added over the last 6 months
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMonths.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-purple-100 p-3 mb-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No data yet
              </p>
              <p className="text-xs text-muted-foreground">
                Start adding methods to see your growth
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMonths.map((month, index) => {
                const count = monthlyData[month]
                const percentage = (count / maxCount) * 100
                const [year, monthNum] = month.split('-')
                const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                
                // Color gradient based on performance
                const barColor = count >= maxCount * 0.75 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                count >= maxCount * 0.5 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                'bg-gradient-to-r from-purple-500 to-purple-600'

                return (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{monthName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {count} {count === 1 ? 'method' : 'methods'}
                        </span>
                        <span className="font-bold text-gray-900 min-w-[2ch] text-right">{count}</span>
                      </div>
                    </div>
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full ${barColor} transition-all duration-500 shadow-sm`}
                        style={{ 
                          width: `${percentage}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                      {percentage > 20 && (
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-[10px] font-bold text-white drop-shadow-sm">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
