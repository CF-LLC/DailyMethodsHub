import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { env } from '@/lib/env'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { generateWebsiteJsonLd } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: env.appName,
    template: `%s | ${env.appName}`,
  },
  description: 'Discover and manage daily earning methods. Track your income opportunities and maximize your earnings with our comprehensive platform.',
  keywords: ['earning methods', 'daily earnings', 'make money online', 'side hustle', 'passive income'],
  authors: [{ name: 'Daily Methods Hub' }],
  creator: 'Daily Methods Hub',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: env.appUrl,
    title: env.appName,
    description: 'Discover and manage daily earning methods',
    siteName: env.appName,
    images: [
      {
        url: `${env.appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: env.appName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: env.appName,
    description: 'Discover and manage daily earning methods',
    images: [`${env.appUrl}/og-image.png`],
    creator: '@dailymethods',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteJsonLd = generateWebsiteJsonLd()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
