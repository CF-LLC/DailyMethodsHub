'use client'

import { useState, useEffect } from 'react'
import { Users, Calendar } from 'lucide-react'
import { getReferralStats, type Referral } from '@/app/actions/referrals'
import { useToast } from '@/components/providers/ToastProvider'
import { formatDistanceToNow } from 'date-fns'

export default function ReferralsList() {
  const { showToast } = useToast()
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [totalReferrals, setTotalReferrals] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReferrals()
  }, [])

  const loadReferrals = async () => {
    setLoading(true)
    try {
      const result = await getReferralStats()
      if (result.success && result.data) {
        setReferrals(result.data.recentReferrals)
        setTotalReferrals(result.data.totalReferrals)
        setTotalPoints(result.data.points?.lifetimePoints || 0)
      } else {
        showToast('error', result.error || 'Failed to load referrals')
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Referrals
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total: </span>
              <span className="font-semibold text-gray-900 dark:text-white">{totalReferrals}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Points: </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{totalPoints}</span>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {referrals.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No referrals yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Share your referral link to start earning points!
            </p>
          </div>
        ) : (
          referrals.map((referral) => (
            <div key={referral.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  <Users className="h-5 w-5" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    User {referral.referredUserId.slice(0, 8)}...
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(referral.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Badge */}
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                  Active
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Note */}
      {referrals.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Showing {referrals.length} most recent referrals
          </p>
        </div>
      )}
    </div>
  )
}
