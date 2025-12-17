import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Bitcoin, Zap, Check, Copy } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata = {
  title: 'Payment | Daily Methods Hub',
  description: 'Complete your premium upgrade',
}

async function PaymentContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/upgrade/payment')
  }

  // Check if already premium
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const sub = subscription as { plan_type: string; status: string } | null
  if (sub && sub.plan_type === 'premium' && sub.status === 'active') {
    redirect('/dashboard')
  }

  const bitcoinAddress = process.env.NEXT_PUBLIC_BITCOIN_ADDRESS
  const lightningAddress = process.env.NEXT_PUBLIC_LIGHTNING_ADDRESS
  const priceBTC = process.env.NEXT_PUBLIC_PREMIUM_PRICE_BTC || '0.0005'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">D</span>
            </div>
            <span className="text-lg font-semibold">Daily Methods Hub</span>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pricing
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Complete Your Payment</h1>
            <p className="text-muted-foreground">
              Send Bitcoin or Lightning payment to unlock premium access
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lightning Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Lightning Network (Recommended)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Instant confirmation • Lower fees • Faster processing
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Lightning Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={lightningAddress}
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(lightningAddress || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                    <p className="text-sm font-medium text-yellow-900">
                      💡 How to pay with Lightning:
                    </p>
                    <ol className="mt-2 space-y-1 text-sm text-yellow-800">
                      <li>1. Open your Lightning wallet (Strike, Cash App, etc.)</li>
                      <li>2. Send {priceBTC} BTC to: <span className="font-mono">{lightningAddress}</span></li>
                      <li>3. Email proof of payment to satoshispath@gmail.com</li>
                      <li>4. Get upgraded within 24 hours</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Bitcoin On-Chain */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bitcoin className="h-5 w-5 text-orange-500" />
                    Bitcoin On-Chain
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Traditional Bitcoin payment • Higher fees • Slower confirmation
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Bitcoin Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={bitcoinAddress}
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(bitcoinAddress || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm font-medium text-blue-900">
                      💡 How to pay with Bitcoin:
                    </p>
                    <ol className="mt-2 space-y-1 text-sm text-blue-800">
                      <li>1. Open your Bitcoin wallet</li>
                      <li>2. Send {priceBTC} BTC to the address above</li>
                      <li>3. Email your transaction ID to satoshispath@gmail.com</li>
                      <li>4. Get upgraded after 1-3 confirmations (~30 min)</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Notice */}
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <div className="text-amber-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900">Manual Verification Required</h3>
                      <p className="mt-1 text-sm text-amber-800">
                        After sending payment, email <strong>satoshispath@gmail.com</strong> with:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-amber-800">
                        <li>• Your account email: <strong>{user.email}</strong></li>
                        <li>• Payment method used (Lightning or Bitcoin)</li>
                        <li>• Transaction ID or proof of payment</li>
                      </ul>
                      <p className="mt-2 text-sm text-amber-800">
                        We'll verify and upgrade your account within 24 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Premium Lifetime Access</h3>
                    <p className="text-sm text-muted-foreground">
                      One-time payment
                    </p>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Unlimited public methods</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Referral code sharing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Featured in directory</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Lifetime access</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold">{priceBTC} BTC</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      ≈ $50 USD
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                    <p className="font-medium">Need Help?</p>
                    <p className="mt-1">
                      Contact us at satoshispath@gmail.com if you have any questions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentContent />
    </Suspense>
  )
}
