import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dailymethodshub.com'

  // Use static client for sitemap (no cookies)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )

  // Get all methods
  const { data: methods } = await supabase
    .from('methods')
    .select('id, updated_at')
    .eq('is_active', true)

  const methodUrls = (methods || []).map((method: any) => ({
    url: `${baseUrl}/methods/${method.id}`,
    lastModified: new Date(method.updated_at),
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
