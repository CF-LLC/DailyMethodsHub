import { Metadata } from 'next'
import { SettingsContent } from '@/components/settings/SettingsContent'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your application settings',
}

export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <SettingsContent />
    </main>
  )
}
