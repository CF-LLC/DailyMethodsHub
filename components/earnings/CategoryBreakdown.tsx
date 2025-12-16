'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface CategoryBreakdownProps {
  data: Array<{
    category: string
    total: number
    count: number
  }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
    count: item.count,
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Earnings by Category
      </h3>
      {chartData.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
