'use client'

import Link from 'next/link'
import { ArrowRight, Clock, DollarSign, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface MethodGridProps {
  methods: any[]
}

export function MethodGrid({ methods }: MethodGridProps) {
  if (methods.length === 0) {
    return (
      <div className="py-20 text-center" id="methods">
        <p className="text-xl text-gray-500">No methods found</p>
        <p className="mt-2 text-gray-400">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div id="methods" className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Available Methods</h2>
        <p className="mt-2 text-gray-600">
          {methods.length} {methods.length === 1 ? 'method' : 'methods'} found
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {methods.map((method) => (
          <MethodCard key={method.id} method={method} />
        ))}
      </div>
    </div>
  )
}

function MethodCard({ method }: { method: any }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {method.iconUrl ? (
            <img
              src={method.iconUrl}
              alt={method.title}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{method.title}</h3>
            <Badge variant="secondary" className="mt-1 capitalize">
              {method.category}
            </Badge>
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600 line-clamp-3">
        {method.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-600">
        {method.earnings && (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>{method.earnings}</span>
          </div>
        )}
        {method.timeRequired && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{method.timeRequired}</span>
          </div>
        )}
        {method.difficulty && (
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            <span className="capitalize">{method.difficulty}</span>
          </div>
        )}
      </div>

      <Link href={`/methods/${method.id}`}>
        <Button className="w-full group-hover:bg-blue-700">
          View Details
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  )
}
