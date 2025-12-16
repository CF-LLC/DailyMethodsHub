import { Suspense } from 'react'
import { getMethods } from '@/app/actions/methods'
import { MethodsManager } from '@/components/MethodsManager'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata = {
  title: 'Methods Manager | Daily Methods Hub',
  description: 'Manage your earning methods',
}

async function MethodsContent() {
  const result = await getMethods()
  const methods = result.success && result.data ? result.data : []

  return <MethodsManager methods={methods} />
}

export default function MethodsManagerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        }
      >
        <MethodsContent />
      </Suspense>
    </div>
  )
}
