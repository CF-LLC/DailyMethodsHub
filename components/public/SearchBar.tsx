'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        placeholder="Search methods..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </form>
  )
}
