'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'freelancing', label: 'Freelancing' },
  { value: 'passive', label: 'Passive Income' },
  { value: 'gig', label: 'Gig Economy' },
  { value: 'online', label: 'Online Work' },
  { value: 'investment', label: 'Investment' },
  { value: 'other', label: 'Other' },
]

interface CategoryFilterProps {
  currentCategory?: string
}

export function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-5 w-5 text-gray-400" />
      <select
        value={currentCategory || 'all'}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  )
}
