'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Gift, Award } from 'lucide-react'
import { getUserPoints } from '@/app/actions/referrals'
import { useToast } from '@/components/providers/ToastProvider'

export default function PointsDisplay() {
  const { showToast } = useToast()
  const [points, setPoints] = useState(0)
  const [lifetimePoints, setLifetimePoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPoints()
  }, [])

  const loadPoints = async () => {
    setLoading(true)
    try {
      const result = await getUserPoints()
      if (result.success && result.data) {
        setPoints(result.data.points)
        setLifetimePoints(result.data.lifetimePoints)
      } else {
        showToast('error', result.error || 'Failed to load points')
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  const tier = 
    points >= 1000 ? 'Platinum' :
    points >= 500 ? 'Gold' :
    points >= 100 ? 'Silver' :
    'Bronze'

  const tierColor = 
    tier === 'Platinum' ? 'text-purple-600 dark:text-purple-400' :
    tier === 'Gold' ? 'text-yellow-600 dark:text-yellow-400' :
    tier === 'Silver' ? 'text-gray-600 dark:text-gray-400' :
    'text-orange-600 dark:text-orange-400'

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Current Points */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Current Points
          </h3>
        </div>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {points.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Available to redeem
        </p>
      </div>

      {/* Lifetime Points */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Lifetime Points
          </h3>
        </div>
        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          {lifetimePoints.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Total earned all-time
        </p>
      </div>

      {/* Current Tier */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Current Tier
          </h3>
        </div>
        <p className={`text-3xl font-bold ${tierColor}`}>
          {tier}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {tier === 'Platinum' && 'Maximum tier reached! 🎉'}
          {tier === 'Gold' && `${1000 - points} points to Platinum`}
          {tier === 'Silver' && `${500 - points} points to Gold`}
          {tier === 'Bronze' && `${100 - points} points to Silver`}
        </p>
      </div>
    </div>
  )
}
