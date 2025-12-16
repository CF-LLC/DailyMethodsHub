'use client'

import { Flame } from 'lucide-react'
import { Streak } from '@/app/actions/streaks'

interface StreakBadgeProps {
  streak: Streak
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Flame className="h-8 w-8" />
          <div>
            <h3 className="text-2xl font-bold">{streak.currentStreak} Days</h3>
            <p className="text-orange-100 text-sm">Current Streak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{streak.longestStreak}</p>
          <p className="text-orange-100 text-sm">Best Streak</p>
        </div>
      </div>
      
      {/* Streak visualization */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {Array.from({ length: Math.min(streak.currentStreak, 30) }, (_, i) => (
          <div
            key={i}
            className="w-2 h-8 bg-white rounded-sm flex-shrink-0"
            style={{
              opacity: 1 - (i * 0.02),
            }}
          />
        ))}
      </div>
      
      <p className="text-xs text-orange-100 mt-3">
        💡 Don&apos;t break the chain! Log your earnings daily to maintain your streak.
      </p>
    </div>
  )
}
