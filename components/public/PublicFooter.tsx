'use client'

import Link from 'next/link'
import { DollarSign, Github, Twitter } from 'lucide-react'

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <div className="rounded-lg bg-blue-600 p-2">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              Daily Methods Hub
            </Link>
            <p className="text-sm text-gray-400">
              Your trusted source for discovering legitimate ways to earn money online.
              From surveys to freelancing, we help you find opportunities that work for you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#methods" className="hover:text-white transition-colors">
                  All Methods
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?category=freelancing" className="hover:text-white transition-colors">
                  Freelancing
                </Link>
              </li>
              <li>
                <Link href="/?category=passive" className="hover:text-white transition-colors">
                  Passive Income
                </Link>
              </li>
              <li>
                <Link href="/?category=gig" className="hover:text-white transition-colors">
                  Gig Economy
                </Link>
              </li>
              <li>
                <Link href="/?category=online" className="hover:text-white transition-colors">
                  Online Work
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm">
            © {currentYear} Daily Methods Hub. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
