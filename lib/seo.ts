// SEO utilities for generating structured data and metadata

export function generateMethodJsonLd(method: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: method.title,
    description: method.description,
    image: method.iconUrl || undefined,
    totalTime: method.timeRequired || undefined,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: method.earnings || '0',
    },
    step: [
      {
        '@type': 'HowToStep',
        name: 'Get Started',
        text: method.description,
        url: method.link || undefined,
      },
    ],
    category: method.category,
    keywords: [method.category, 'earn money online', method.difficulty, 'side hustle'].join(', '),
  }
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Daily Methods Hub',
    description: 'Discover the best ways to earn money online',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dailymethodshub.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dailymethodshub.com'}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
