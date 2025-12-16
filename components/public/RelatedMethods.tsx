'use client'

import Link from 'next/link'
import { ArrowRight, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface RelatedMethodsProps {
  methods: any[]
}

export function RelatedMethods({ methods }: RelatedMethodsProps) {
  if (methods.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">No related methods found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {methods.map((method) => (
        <div
          key={method.id}
          className="group overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="mb-3 flex items-center gap-3">
            {method.iconUrl ? (
              <img
                src={method.iconUrl}
                alt={method.title}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-1">{method.title}</h3>
              <Badge variant="secondary" className="mt-1 text-xs capitalize">
                {method.category}
              </Badge>
            </div>
          </div>

          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {method.description}
          </p>

          <Link href={`/methods/${method.id}`}>
            <Button variant="outline" size="sm" className="w-full group-hover:bg-gray-50">
              View Method
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  )
}
