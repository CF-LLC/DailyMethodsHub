'use client'

import Link from 'next/link'
import { ExternalLink, Clock, DollarSign, BarChart3, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface MethodDetailContentProps {
  method: any
}

export function MethodDetailContent({ method }: MethodDetailContentProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Back Button */}
      <Link href="/" className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-700">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all methods
      </Link>

      {/* Main Content Card */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-lg">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-8">
          <div className="flex items-start gap-4">
            {method.iconUrl ? (
              <img
                src={method.iconUrl}
                alt={method.title}
                className="h-20 w-20 rounded-xl object-cover shadow-md"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-600 shadow-md">
                <DollarSign className="h-10 w-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{method.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="capitalize">
                  {method.category}
                </Badge>
                {method.difficulty && (
                  <Badge variant="secondary" className="capitalize">
                    {method.difficulty}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 border-b bg-gray-50 p-6 sm:grid-cols-3">
          {method.earnings && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Potential Earnings</p>
                <p className="font-semibold">{method.earnings}</p>
              </div>
            </div>
          )}
          {method.timeRequired && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Required</p>
                <p className="font-semibold">{method.timeRequired}</p>
              </div>
            </div>
          )}
          {method.difficulty && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-semibold capitalize">{method.difficulty}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-8">
          <h2 className="mb-4 text-xl font-semibold">About This Method</h2>
          <p className="whitespace-pre-line text-gray-700 leading-relaxed">
            {method.description}
          </p>
        </div>

        {/* CTA Section */}
        {method.link && (
          <div className="border-t bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="mb-3 text-2xl font-bold">Ready to Get Started?</h3>
              <p className="mb-6 text-blue-100">
                Click the button below to visit the official website and start earning today!
              </p>
              <a
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg"
                >
                  Get Started Now
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
