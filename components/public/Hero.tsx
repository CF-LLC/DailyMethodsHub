'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="container relative mx-auto px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>Discover new earning opportunities daily</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Start Earning Money
            <br />
            <span className="text-blue-200">Online Today</span>
          </h1>
          
          <p className="mb-8 text-lg text-blue-100 sm:text-xl">
            Explore hundreds of verified methods to earn extra income. From surveys to
            freelancing, find opportunities that fit your schedule and skills.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="#methods">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                Browse Methods
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full text-gray-50"
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 48h1440V0C1440 0 1200 48 720 48S0 0 0 0v48z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  )
}
