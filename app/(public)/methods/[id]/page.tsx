import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMethodById, getPublicMethods } from '@/app/actions/public-methods'
import { MethodDetailContent } from '@/components/public/MethodDetailContent'
import { RelatedMethods } from '@/components/public/RelatedMethods'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { generateMethodJsonLd } from '@/lib/seo'

interface MethodPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: MethodPageProps): Promise<Metadata> {
  const result = await getMethodById(params.id)

  if (!result.success || !result.data) {
    return {
      title: 'Method Not Found',
    }
  }

  const method = result.data

  return {
    title: `${method.title} - Daily Methods Hub`,
    description: method.description,
    keywords: [method.category, 'earn money online', method.difficulty, 'side hustle'],
    openGraph: {
      title: method.title,
      description: method.description,
      type: 'article',
      images: method.iconUrl ? [{ url: method.iconUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: method.title,
      description: method.description,
      images: method.iconUrl ? [method.iconUrl] : [],
    },
  }
}

async function RelatedMethodsContent({ category, currentId }: { category: string; currentId: string }) {
  const result = await getPublicMethods({ category })
  const methods = result.success ? (result.data || []).filter((m: any) => m.id !== currentId).slice(0, 3) : []

  return <RelatedMethods methods={methods} />
}

export default async function MethodPage({ params }: MethodPageProps) {
  const result = await getMethodById(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const method = result.data
  const jsonLd = generateMethodJsonLd(method)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Method Detail */}
          <MethodDetailContent method={method} />

          {/* Related Methods */}
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">Related Methods</h2>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-10">
                  <LoadingSpinner className="h-8 w-8" />
                </div>
              }
            >
              <RelatedMethodsContent category={method.category} currentId={method.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
