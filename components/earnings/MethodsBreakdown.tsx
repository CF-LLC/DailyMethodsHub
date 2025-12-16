'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface MethodsBreakdownProps {
  data: Array<{
    methodTitle: string
    total: number
    count: number
  }>
}

export default function MethodsBreakdown({ data }: MethodsBreakdownProps) {
  // Sort by total descending and take top 10
  const topMethods = [...data]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Top Methods by Earnings
      </h3>
      {topMethods.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topMethods} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              type="number"
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <YAxis
              type="category"
              dataKey="methodTitle"
              className="text-xs text-gray-600 dark:text-gray-400"
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'total') return [`$${value.toFixed(2)}`, 'Total']
                return [value, 'Entries']
              }}
            />
            <Legend />
            <Bar dataKey="total" fill="#3b82f6" name="Total" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
