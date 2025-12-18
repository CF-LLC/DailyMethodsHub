import { Suspense } from 'react'
import { Metadata } from 'next'
import { Hero } from '@/components/public/Hero'
import { MethodGrid } from '@/components/public/MethodGrid'
import { CategoryFilter } from '@/components/public/CategoryFilter'
import { SearchBar } from '@/components/public/SearchBar'
import { getPublicMethods } from '@/app/actions/public-methods'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Daily Methods Hub - Discover Ways to Earn Money Online',
  description: 'Find the best methods to earn money online. Explore surveys, freelancing, passive income, and more. Start earning today!',
  keywords: ['earn money online', 'side hustle', 'passive income', 'surveys', 'freelancing'],
  openGraph: {
    title: 'Daily Methods Hub - Discover Ways to Earn Money Online',
    description: 'Find the best methods to earn money online',
    type: 'website',
  },
}

interface HomePageProps {
  searchParams: {
    category?: string
    search?: string
  }
}

async function MethodsContent({ category, search }: { category?: string; search?: string }) {
  const result = await getPublicMethods({ category, search })
  const methods = result.success ? (result.data || []) : []

  return <MethodGrid methods={methods} />
}

export default function HomePage({ searchParams }: HomePageProps) {
  const category = searchParams.category
  const search = searchParams.search

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Search and Filter Section */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchBar />
            <CategoryFilter currentCategory={category} />
          </div>
        </div>
      </div>

      {/* Methods Grid */}
      <div className="container mx-auto px-4 py-12">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner className="h-10 w-10" />
            </div>
          }
        >
          <MethodsContent category={category} search={search} />
        </Suspense>
      </div>
    </div>
  )
}
