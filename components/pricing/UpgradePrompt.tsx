'use client'

import { Crown, X, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  description?: string
}

const PREMIUM_BENEFITS = [
  'Unlimited custom methods',
  'Advanced analytics & forecasting',
  'Unlimited CSV import/export',
  'Priority support',
  'Ad-free experience',
  'Early access to new features',
]

export default function UpgradePrompt({ isOpen, onClose, feature, description }: UpgradePromptProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/pricing')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Upgrade to Premium
        </h2>

        {/* Feature Description */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            <strong className="text-gray-900 dark:text-white">{feature}</strong> is a Premium feature.
          </p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {description}
            </p>
          )}
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Premium Benefits
            </h3>
          </div>
          <ul className="space-y-2 text-left">
            {PREMIUM_BENEFITS.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 bg-blue-600 dark:text-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">$9</span>
            <span className="text-gray-600 dark:text-gray-400">/month</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Cancel anytime • 14-day money-back guarantee
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Crown className="h-4 w-4 mr-2" />
            View Plans
          </Button>
        </div>
      </div>
    </Modal>
  )
}
