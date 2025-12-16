'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import { generateReferralCode } from '@/app/actions/referrals'
import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/Button'

export default function ReferralLinkGenerator() {
  const { showToast } = useToast()
  const [referralCode, setReferralCode] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReferralCode()
  }, [])

  const loadReferralCode = async () => {
    setLoading(true)
    try {
      const result = await generateReferralCode()
      if (result.success && result.data) {
        setReferralCode(result.data)
      } else {
        showToast('error', result.error || 'Failed to generate referral code')
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const referralLink = referralCode
    ? `${window.location.origin}/signup?ref=${referralCode}`
    : ''

  const handleCopy = async () => {
    if (!referralLink) return
    
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      showToast('success', 'Referral link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      showToast('error', 'Failed to copy link')
    }
  }

  const handleShare = async () => {
    if (!referralLink) return

    const shareData = {
      title: 'Join DailyMethodsHub',
      text: 'Track your daily earnings and discover profitable methods with DailyMethodsHub!',
      url: referralLink,
    }

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        showToast('success', 'Shared successfully')
      } catch (error) {
        // User cancelled share or error occurred
      }
    } else {
      // Fallback to copy
      handleCopy()
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Referral Link
        </h2>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Share this link with friends. When they sign up and start tracking earnings, you'll both earn bonus points!
      </p>

      {/* Referral Link Display */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white font-mono truncate">
          {referralLink}
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          className="flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Social Share Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleShare} size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Join me on DailyMethodsHub to track your daily earnings!')}&url=${encodeURIComponent(referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
          Tweet
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-[#1877F2] text-white hover:bg-[#166fe5] transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Share
        </a>

        <a
          href={`mailto:?subject=${encodeURIComponent('Join DailyMethodsHub')}&body=${encodeURIComponent(`Check out DailyMethodsHub to track your daily earnings: ${referralLink}`)}`}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </a>
      </div>

      {/* Bonus Info */}
      <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          💡 <strong>Bonus:</strong> Earn +25 points when someone signs up using your link, plus +1 point for every earning they log!
        </p>
      </div>
    </div>
  )
}
