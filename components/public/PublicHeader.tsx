'use client'

import Link from 'next/link'
import { DollarSign } from 'lucide-react'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="rounded-lg bg-blue-600 p-2">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          Daily Methods Hub
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link href="/#methods" className="text-gray-600 hover:text-gray-900 transition-colors">
            Methods
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </nav>

        <Link
          href="/auth/login"
          className="md:hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Sign In
        </Link>
      </div>
    </header>
  )
}
