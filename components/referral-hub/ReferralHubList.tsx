'use client'

import { useState } from 'react'
import { Search, Plus, ExternalLink, Users, TrendingUp, Copy, Check, Star, Gift } from 'lucide-react'
import { copyMethodToMyMethods } from '@/app/actions/explore'
import { useToast } from '@/components/providers/ToastProvider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface ReferralMethod {
  id: string
  title: string
  description: string
  category: string
  earnings: string
  difficulty: string
  timeRequired: string
  link?: string | null
  referralCode?: string | null
  iconUrl?: string | null
  userEmail: string
  createdAt: Date
}

interface ReferralHubListProps {
  initialMethods: ReferralMethod[]
}

export default function ReferralHubList({ initialMethods }: ReferralHubListProps) {
  const { showToast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [addingMethod, setAddingMethod] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const categories = ['all', ...Array.from(new Set(initialMethods.map(m => m.category)))]

  const filteredMethods = initialMethods.filter(method => {
    const matchesSearch = 
      method.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      method.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || method.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleAddMethod = async (methodId: string) => {
    setAddingMethod(methodId)
    try {
      const result = await copyMethodToMyMethods(methodId)
      if (result.success) {
        showToast('success', result.message || 'Method added to your list!')
        router.refresh()
      } else {
        showToast('error', result.error || 'Failed to add method')
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred')
    } finally {
      setAddingMethod(null)
    }
  }

  const copyReferralCode = (code: string, methodId: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(methodId)
    showToast('success', 'Referral code copied!')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
      case 'beginner':
        return 'success'
      case 'medium':
      case 'intermediate':
        return 'warning'
      case 'hard':
      case 'advanced':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 sm:p-8 text-primary-foreground shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Referral Hub</h1>
          </div>
          <p className="text-base sm:text-lg text-primary-foreground/90 max-w-2xl">
            Discover exclusive methods with referral codes. Earn more together by sharing and using community referrals!
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold">{initialMethods.length} Methods</span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold">Community Curated</span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search referral methods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
              className="capitalize whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredMethods.length}</span> referral {filteredMethods.length === 1 ? 'method' : 'methods'}
        </p>
      </div>

      {/* Methods Grid */}
      {filteredMethods.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No methods found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMethods.map((method) => (
            <div
              key={method.id}
              className="group relative border-2 rounded-lg sm:rounded-xl p-4 sm:p-6 bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              {/* Premium badge for methods with referral codes */}
              {method.referralCode && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-current" />
                    REFERRAL
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                {method.iconUrl ? (
                  <img
                    src={method.iconUrl}
                    alt={method.title}
                    className="h-14 w-14 rounded-xl object-cover flex-shrink-0 ring-2 ring-border"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xl flex-shrink-0">
                    {method.title[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{method.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Shared by {method.userEmail.split('@')[0]}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {method.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="default" className="capitalize text-xs">
                  {method.category}
                </Badge>
                <Badge variant={getDifficultyColor(method.difficulty)} className="text-xs">
                  {method.difficulty}
                </Badge>
                {method.earnings && (
                  <Badge variant="success" className="text-xs font-semibold">
                    💰 {method.earnings}
                  </Badge>
                )}
              </div>

              {/* Referral Code Section */}
              {method.referralCode && (
                <div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Referral Code</p>
                      <p className="font-mono font-bold text-sm truncate">{method.referralCode}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyReferralCode(method.referralCode!, method.id)}
                      className="flex-shrink-0"
                    >
                      {copiedCode === method.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Time Required */}
              {method.timeRequired && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>⏱️</span>
                  <span>{method.timeRequired}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 font-semibold"
                  onClick={() => handleAddMethod(method.id)}
                  disabled={addingMethod === method.id}
                >
                  {addingMethod === method.id ? (
                    <>Adding...</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add to My Methods
                    </>
                  )}
                </Button>
                {method.link && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => window.open(method.link || '', '_blank')}
                    title="Visit site"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
