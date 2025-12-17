import { MetadataRoute } from 'next'
import { getPublicMethods } from '@/app/actions/public-methods'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dailymethodshub.com'

  // Get all methods
  const result = await getPublicMethods({})
  const methods = result.success ? result.data : []

  const methodUrls = (methods || []).map((method: any) => ({
    url: `${baseUrl}/methods/${method.id}`,
    lastModified: new Date(method.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...methodUrls,
  ]
}
