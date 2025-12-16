'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createEarningEntry, updateEarningEntry } from '@/app/actions/earnings'
import { getMethods } from '@/app/actions/methods'
import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useRouter } from 'next/navigation'

interface Method {
  id: string
  title: string
  category: string
}

interface Earning {
  id: string
  methodId: string
  amount: number
  entryDate: string
  notes?: string | null
}

interface AddEarningModalProps {
  isOpen: boolean
  onClose: () => void
  earning?: Earning | null
}

export default function AddEarningModal({ isOpen, onClose, earning }: AddEarningModalProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [methods, setMethods] = useState<Method[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMethods, setLoadingMethods] = useState(true)
  
  const [formData, setFormData] = useState({
    methodId: '',
    amount: '',
    entryDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load methods on mount
  useEffect(() => {
    async function loadMethods() {
      setLoadingMethods(true)
      const result = await getMethods()
      if (result.success && result.data) {
        setMethods(result.data)
      }
      setLoadingMethods(false)
    }
    loadMethods()
  }, [])

  // Populate form when editing
  useEffect(() => {
    if (earning) {
      setFormData({
        methodId: earning.methodId,
        amount: earning.amount.toString(),
        entryDate: earning.entryDate,
        notes: earning.notes || '',
      })
    } else {
      setFormData({
        methodId: '',
        amount: '',
        entryDate: new Date().toISOString().split('T')[0],
        notes: '',
      })
    }
    setErrors({})
  }, [earning, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.methodId) {
      newErrors.methodId = 'Method is required'
    }
    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (parseFloat(formData.amount) < 0) {
      newErrors.amount = 'Amount must be positive'
    }
    if (!formData.entryDate) {
      newErrors.entryDate = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setLoading(true)

    try {
      const data = {
        methodId: formData.methodId,
        amount: parseFloat(formData.amount),
        entryDate: formData.entryDate,
        notes: formData.notes || undefined,
      }

      const result = earning
        ? await updateEarningEntry({ id: earning.id, ...data })
        : await createEarningEntry(data)

      if (result.success) {
        showToast(
          'success',
          earning ? 'Earning updated successfully' : 'Earning added successfully'
        )
        router.refresh()
        onClose()
      } else {
        showToast('error', result.error || 'Failed to save earning')
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={earning ? 'Edit Earning' : 'Add Earning'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Method Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Method *
          </label>
          <select
            value={formData.methodId}
            onChange={(e) => handleChange('methodId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.methodId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loadingMethods}
          >
            <option value="">Select a method</option>
            {methods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.title} ({method.category})
              </option>
            ))}
          </select>
          {errors.methodId && (
            <p className="text-sm text-red-500 mt-1">{errors.methodId}</p>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount ($) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date *
          </label>
          <input
            type="date"
            value={formData.entryDate}
            onChange={(e) => handleChange('entryDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.entryDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.entryDate && (
            <p className="text-sm text-red-500 mt-1">{errors.entryDate}</p>
          )}
        </div>

        {/* Notes Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Add any notes about this earning..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : earning ? 'Update' : 'Add Earning'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
