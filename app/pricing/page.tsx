import { Metadata } from 'next'
import { Check, X, Crown, Sparkles } from 'lucide-react'
import CheckoutButton from '@/components/pricing/CheckoutButton'

export const metadata: Metadata = {
  title: 'Pricing - DailyMethodsHub',
  description: 'Choose the perfect plan for tracking your daily earnings',
}

const FREE_FEATURES = [
  'Track unlimited daily earnings',
  'Up to 10 custom methods',
  'Basic analytics dashboard',
  'Daily streak tracking',
  'Export up to 100 entries (CSV)',
  'In-app notifications',
  'Referral system access',
]

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Unlimited custom methods',
  'Advanced analytics & insights',
  'Priority support',
  'Unlimited CSV export/import',
  'Custom categories',
  'Earnings forecasting',
  'Ad-free experience',
  'Early access to new features',
]

const PREMIUM_ONLY = [
  'Advanced analytics & insights',
  'Priority support',
  'Unlimited CSV export/import',
  'Custom categories',
  'Earnings forecasting',
  'Ad-free experience',
  'Early access to new features',
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start free and upgrade when you need advanced features. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Free
              </h2>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Perfect for getting started with daily earnings tracking
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl border-2 border-blue-500 p-8 relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-bl-lg flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              POPULAR
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">
                  Premium
                </h2>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-white">$9</span>
                <span className="text-blue-100">/month</span>
              </div>
              <p className="text-blue-100">
                Unlock advanced features and maximize your earnings insights
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {PREMIUM_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className={`${PREMIUM_ONLY.includes(feature) ? 'text-white font-medium' : 'text-blue-100'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <CheckoutButton />
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl mx-auto mb-16">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Feature Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Custom Methods</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Up to 10</td>
                  <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-semibold">Unlimited</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Daily Earnings Tracking</td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Basic Analytics</td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Advanced Analytics</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">CSV Export</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">100 entries</td>
                  <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-semibold">Unlimited</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Priority Support</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Earnings Forecasting</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Ad-Free Experience</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                <span>Can I cancel my subscription anytime?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Yes! You can cancel your Premium subscription at any time. You'll continue to have access to Premium features until the end of your billing period.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                <span>What payment methods do you accept?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                We accept all major credit cards (Visa, MasterCard, American Express) through our secure payment processor, Stripe.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                <span>What happens to my data if I downgrade?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                All your data is preserved. If you have more than 10 methods, you'll still be able to view them, but won't be able to create new ones until you're back under the limit or upgrade again.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                <span>Do you offer refunds?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                We offer a 14-day money-back guarantee. If you're not satisfied with Premium within the first 14 days, contact support for a full refund.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 group">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                <span>Can I switch between plans?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Yes, you can upgrade to Premium at any time. The upgrade takes effect immediately. If you downgrade, changes will take effect at the end of your current billing period.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
