import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardContent } from '@/components/layout/DashboardContent'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <DashboardContent>
        {children}
      </DashboardContent>
    </div>
  )
}
