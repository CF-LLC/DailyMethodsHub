'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Users, TrendingUp, Gift, Zap, Target } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      title: 'Add New Method',
      description: 'Create earning opportunity',
      icon: Plus,
      href: '/methods?action=new',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Referral Hub',
      description: 'Share & earn more',
      icon: Gift,
      href: '/referral-hub',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Track Earnings',
      description: 'View your progress',
      icon: TrendingUp,
      href: '/earnings',
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'My Methods',
      description: 'Manage your methods',
      icon: Target,
      href: '/methods',
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <CardTitle>Quick Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <button
                className="group flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div className={`rounded-lg p-2.5 ${action.iconBg} transition-transform group-hover:scale-110`}>
                  <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-gray-700">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
                <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${action.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
              </button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
