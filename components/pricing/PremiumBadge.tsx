'use client'

import { Crown } from 'lucide-react'

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function PremiumBadge({ size = 'md' }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-full ${sizeClasses[size]}`}>
      <Crown className={iconSizes[size]} />
      Premium
    </span>
  )
}
