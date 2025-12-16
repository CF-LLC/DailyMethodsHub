'use client'

import { Gift, Star, TrendingUp, Zap } from 'lucide-react'

const REWARDS_CONFIG = [
  {
    icon: Star,
    title: 'Referral Signup',
    points: 25,
    color: 'text-yellow-600 dark:text-yellow-400',
    description: 'When someone signs up using your link',
  },
  {
    icon: Zap,
    title: 'Daily Earning',
    points: 1,
    color: 'text-blue-600 dark:text-blue-400',
    description: 'For every earning entry you or your referrals log',
  },
  {
    icon: Gift,
    title: '7-Day Streak',
    points: 10,
    color: 'text-orange-600 dark:text-orange-400',
    description: 'Bonus for maintaining a 7-day logging streak',
  },
  {
    icon: TrendingUp,
    title: '30-Day Streak',
    points: 50,
    color: 'text-green-600 dark:text-green-400',
    description: 'Bonus for maintaining a 30-day logging streak',
  },
  {
    icon: Star,
    title: '100-Day Streak',
    points: 200,
    color: 'text-purple-600 dark:text-purple-400',
    description: 'Bonus for maintaining a 100-day logging streak',
  },
]

const TIERS = [
  { name: 'Bronze', minPoints: 0, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
  { name: 'Silver', minPoints: 100, color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
  { name: 'Gold', minPoints: 500, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  { name: 'Platinum', minPoints: 1000, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
]

export default function RewardsInfo() {
  return (
    <div className="space-y-6">
      {/* How to Earn Points */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          How to Earn Points
        </h3>
        <div className="space-y-4">
          {REWARDS_CONFIG.map((reward, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-900 ${reward.color}`}>
                <reward.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {reward.title}
                  </h4>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    +{reward.points}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {reward.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reward Tiers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          Reward Tiers
        </h3>
        <div className="space-y-3">
          {TIERS.map((tier, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tier.color}`}>
                  {tier.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {tier.minPoints}+ points
                </span>
              </div>
              {index < TIERS.length - 1 && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {TIERS[index + 1].minPoints - tier.minPoints} to next tier
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Higher tiers unlock exclusive features and perks (coming soon!)
          </p>
        </div>
      </div>

      {/* Volume Bonuses */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          Volume Bonuses
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">$1,000+ monthly</span>
            <span className="font-semibold text-green-600 dark:text-green-400">+10 points</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">$5,000+ monthly</span>
            <span className="font-semibold text-green-600 dark:text-green-400">+50 points</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">$10,000+ monthly</span>
            <span className="font-semibold text-green-600 dark:text-green-400">+100 points</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
          Earn bonus points when your total monthly earnings reach these milestones!
        </p>
      </div>
    </div>
  )
}
