import { Metadata } from 'next'
import { Share2, Gift, TrendingUp } from 'lucide-react'
import ReferralLinkGenerator from '@/components/referrals/ReferralLinkGenerator'
import PointsDisplay from '@/components/referrals/PointsDisplay'
import ReferralsList from '@/components/referrals/ReferralsList'
import RewardsInfo from '@/components/referrals/RewardsInfo'

export const metadata: Metadata = {
  title: 'Referrals & Rewards',
  description: 'Share DailyMethodsHub and earn points for rewards',
}

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Referrals & Rewards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share DailyMethodsHub with friends and earn points for exclusive rewards
          </p>
        </div>

        {/* Points Display */}
        <div className="mb-8">
          <PointsDisplay />
        </div>

        {/* Referral Link Generator */}
        <div className="mb-8">
          <ReferralLinkGenerator />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Referrals - 2/3 width */}
          <div className="lg:col-span-2">
            <ReferralsList />
          </div>

          {/* Rewards Info - 1/3 width */}
          <div className="lg:col-span-1">
            <RewardsInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
