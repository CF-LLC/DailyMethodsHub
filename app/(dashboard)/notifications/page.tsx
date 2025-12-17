import { Suspense } from 'react'
import { Metadata } from 'next'
import { getUserNotifications } from '@/app/actions/notifications'
import NotificationsPageContent from '@/components/notifications/NotificationsPageContent'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'View all your notifications',
}

async function NotificationsData() {
  const response = await getUserNotifications()
  const notifications = response.data || []

  return <NotificationsPageContent initialNotifications={notifications} />
}

export default function NotificationsPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <NotificationsData />
      </Suspense>
    </main>
  )
}
