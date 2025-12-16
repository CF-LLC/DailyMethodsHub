'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AmountDistributionProps {
  data: Array<{
    range: string
    count: number
  }>
}

export default function AmountDistribution({ data }: AmountDistributionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Earnings Amount Distribution
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="range"
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [value, 'Entries']}
            />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
