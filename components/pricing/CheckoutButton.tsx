'use client'

import { useState } from 'react'
import { Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/Button'

export default function CheckoutButton() {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        showToast('error', data.error || 'Failed to start checkout')
        setLoading(false)
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-white hover:bg-gray-100 text-blue-600 font-semibold"
    >
      <Crown className="h-5 w-5 mr-2" />
      {loading ? 'Loading...' : 'Upgrade to Premium'}
    </Button>
  )
}
