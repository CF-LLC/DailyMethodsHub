'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Clock, ExternalLink, Edit, Gift, ArrowRight, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface RecentMethodsProps {
  methods: any[]
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Survey: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Cashback: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Task: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Referral: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Investment: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
}

export function RecentMethods({ methods }: RecentMethodsProps) {
  if (methods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-4 mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              No methods yet
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Create your first earning method to start tracking opportunities and building income streams.
            </p>
            <Link href="/methods?action=new">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Method
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Recent Methods</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {methods.length}
          </Badge>
        </div>
        <Link href="/methods">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {methods.map((method) => {
            const categoryStyle = categoryColors[method.category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
            
            return (
              <div
                key={method.id}
                className="group relative flex items-start gap-4 rounded-xl border p-4 transition-all hover:border-gray-300 hover:shadow-md"
              >
                {/* Category Color Indicator */}
                <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${categoryStyle.bg}`} />
                
                <div className="flex-1 pl-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{method.title}</h3>
                      {method.referralCode && (
                        <Badge variant="warning" className="gap-1 text-xs">
                          <Gift className="h-3 w-3" />
                          REFERRAL
                        </Badge>
                      )}
                    </div>
                    <Badge variant={method.isActive ? 'success' : 'secondary'} className="shrink-0">
                      {method.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {method.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}>
                      {method.category}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {method.timeRequired}
                    </span>
                    <span className="font-semibold text-green-600">
                      {method.earnings}
                    </span>
                    <span className={`px-2 py-1 rounded-md ${
                      method.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      method.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {method.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {method.link && (
                    <a href={method.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  <Link href={`/methods?edit=${method.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
