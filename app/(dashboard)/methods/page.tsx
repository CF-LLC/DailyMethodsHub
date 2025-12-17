import { Suspense } from 'react'
import { Metadata } from 'next'
import { getMethods } from '@/app/actions/methods'
import { MethodsList } from '@/components/MethodsList'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Methods',
  description: 'Manage your daily earning methods',
}

async function MethodsContent() {
  const response = await getMethods()
  const methods = response.data || []

  return <MethodsList initialMethods={methods} />
}

export default function MethodsPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <MethodsContent />
      </Suspense>
    </main>
  )
}
