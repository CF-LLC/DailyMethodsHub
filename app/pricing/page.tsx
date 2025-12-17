import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Check, Bitcoin, Zap } from 'lucide-react'

export const metadata = {
  title: 'Pricing | Daily Methods Hub',
  description: 'Upgrade to premium and unlock unlimited earning methods',
}

export default function PricingPage() {
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
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Unlock Your Earning Potential
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Upgrade to premium and share your earning methods with the world. One-time payment, lifetime access.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground"> / forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Perfect for getting started with your earning journey
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>Browse public earning methods</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>Track your daily earnings</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>Create private methods (for personal use)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>Basic support</span>
                </li>
              </ul>
              <Link href="/dashboard" className="block w-full">
                <Button variant="outline" className="w-full">
                  Current Plan
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{priceBTC} BTC</span>
                <span className="text-muted-foreground"> / lifetime</span>
              </div>
              <p className="text-sm text-muted-foreground">≈ $50 USD</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                One-time payment for unlimited access forever
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="font-medium">Everything in Free, plus:</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>
                    <strong>Unlimited public methods</strong> - Share your earning strategies
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>
                    <strong>Referral code sharing</strong> - Earn from your referrals
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>
                    <strong>Featured in directory</strong> - Get discovered by thousands
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>
                    <strong>Priority support</strong> - Get help when you need it
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>
                    <strong>Lifetime access</strong> - Pay once, use forever
                  </span>
                </li>
              </ul>

              <div className="space-y-3 pt-4">
                <Link href="/upgrade/payment" className="block w-full">
                  <Button className="w-full" size="lg">
                    <Bitcoin className="mr-2 h-5 w-5" />
                    Pay with Bitcoin
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Bitcoin className="h-4 w-4" />
                  <span>Bitcoin On-Chain</span>
                  <span>•</span>
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Lightning Network</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Bitcoin payment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bitcoin payments are fast, secure, and borderless. No credit card fees, no chargebacks, 
                  and you maintain full privacy. We support both on-chain Bitcoin and Lightning Network 
                  for instant, low-fee payments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does verification take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lightning payments are typically verified within 24 hours. Bitcoin on-chain payments 
                  are verified after 1-3 confirmations (approximately 30 minutes to 1 hour). You'll 
                  receive an email once your premium access is activated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is this really lifetime access?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! One payment gives you unlimited premium features forever. No recurring fees, 
                  no subscriptions. Pay once and you're set for life.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I get a refund?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Due to the nature of Bitcoin transactions being irreversible, we don't offer refunds. 
                  However, if you have any issues or concerns, please contact satoshispath@gmail.com 
                  and we'll work with you to resolve them.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">I don't have Bitcoin. What should I do?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can easily get Bitcoin from exchanges like Coinbase, Cash App, or Strike. 
                  For Lightning payments, Strike and Cash App are the easiest options. If you need help, 
                  email us at satoshispath@gmail.com.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
