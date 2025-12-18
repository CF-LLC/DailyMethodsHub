'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { createMethod, updateMethod } from '@/app/actions/methods'
import { useToast } from '@/components/providers/ToastProvider'
import { useRouter } from 'next/navigation'

interface MethodFormModalProps {
  isOpen: boolean
  onClose: () => void
  method?: any
}

const CATEGORIES = ['freelancing', 'passive', 'gig', 'online', 'investment', 'other']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export function MethodFormModal({ isOpen, onClose, method }: MethodFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'freelancing',
    link: '',
    iconUrl: '',
    earnings: '',
    timeRequired: '',
    difficulty: 'Easy',
    referralCode: '',
    isActive: true,
    isPublic: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (method) {
      setFormData({
        title: method.title || '',
        description: method.description || '',
        category: method.category || 'freelancing',
        link: method.link || '',
        iconUrl: method.iconUrl || '',
        earnings: method.earnings || '',
        timeRequired: method.timeRequired || '',
        difficulty: method.difficulty || 'Easy',
        referralCode: method.referralCode || '',
        isActive: method.isActive ?? true,
        isPublic: method.isPublic ?? false,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'freelancing',
        link: '',
        iconUrl: '',
        earnings: '',
        timeRequired: '',
        difficulty: 'Easy',
        referralCode: '',
        isActive: true,
        isPublic: false,
      })
    }
    setErrors({})
  }, [method, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL'
    }

    if (formData.iconUrl && !isValidUrl(formData.iconUrl)) {
      newErrors.iconUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSaving(true)

    try {
      let result
      if (method) {
        result = await updateMethod({ id: method.id, ...formData } as any)
      } else {
        result = await createMethod(formData as any)
      }

      if (result.success) {
        showToast('success', `Method ${method ? 'updated' : 'created'} successfully`)
        onClose()
        router.refresh()
      } else {
        showToast('error', result.error || 'Failed to save method')
      }
    } catch (error) {
      showToast('error', 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl my-8">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {method ? 'Edit Method' : 'Create Method'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSaving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter method title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter method description"
              rows={4}
              className={`w-full rounded-md border ${
                errors.description ? 'border-red-500' : 'border-input'
              } bg-background px-3 py-2 text-sm`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="earnings" className="block text-sm font-medium mb-1">
                Earnings
              </label>
              <Input
                id="earnings"
                value={formData.earnings}
                onChange={(e) => setFormData({ ...formData, earnings: e.target.value })}
                placeholder="e.g., $100-$500/month"
              />
            </div>

            <div>
              <label htmlFor="timeRequired" className="block text-sm font-medium mb-1">
                Time Required
              </label>
              <Input
                id="timeRequired"
                value={formData.timeRequired}
                onChange={(e) => setFormData({ ...formData, timeRequired: e.target.value })}
                placeholder="e.g., 2-4 hours/day"
              />
            </div>
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium mb-1">
              Link (URL)
            </label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com"
              className={errors.link ? 'border-red-500' : ''}
            />
            {errors.link && (
              <p className="text-sm text-red-600 mt-1">{errors.link}</p>
            )}
          </div>

          <div>
            <label htmlFor="iconUrl" className="block text-sm font-medium mb-1">
              Icon URL
            </label>
            <Input
              id="iconUrl"
              type="url"
              value={formData.iconUrl}
              onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
              placeholder="https://example.com/icon.png"
              className={errors.iconUrl ? 'border-red-500' : ''}
            />
            {errors.iconUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.iconUrl}</p>
            )}
          </div>

          <div>
            <label htmlFor="referralCode" className="block text-sm font-medium mb-1">
              Referral Code (Optional)
            </label>
            <Input
              id="referralCode"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
              placeholder="Your referral code"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add your referral code to help others and earn rewards
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active (visible to you)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Share publicly (let others discover and use this method)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                method ? 'Update Method' : 'Create Method'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
