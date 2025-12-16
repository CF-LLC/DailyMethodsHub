import { Suspense } from 'react'
import { Metadata } from 'next'
import { getPublicMethods } from '@/app/actions/explore'
import ReferralHubList from '@/components/referral-hub/ReferralHubList'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Referral Hub',
  description: 'Discover methods with exclusive referral codes and earn more together',
}

async function ReferralHubContent() {
  const response = await getPublicMethods()
  const methods = response.data || []

  return <ReferralHubList initialMethods={methods} />
}

export default function ReferralHubPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <ReferralHubContent />
      </Suspense>
    </main>
  )
}
