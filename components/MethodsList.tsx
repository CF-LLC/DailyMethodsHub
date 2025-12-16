'use client'

import { useState } from 'react'
import { Method } from '@/types'
import { MethodCard } from '@/components/MethodCard'
import { MethodFormModal } from '@/components/MethodFormModal'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Plus, List } from 'lucide-react'
import { deleteMethod } from '@/app/actions/methods'
import { useRouter } from 'next/navigation'

interface MethodsListProps {
  initialMethods: Method[]
}

export function MethodsList({ initialMethods }: MethodsListProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<Method | null>(null)

  const handleEdit = (method: Method) => {
    setEditingMethod(method)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this method?')) {
      await deleteMethod(id)
      router.refresh()
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMethod(null)
  }

  const handleCreateNew = () => {
    setEditingMethod(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Methods"
        description={`${initialMethods.length} earning ${initialMethods.length === 1 ? 'method' : 'methods'}`}
        icon={<List className="h-6 w-6" />}
        action={
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Method
          </Button>
        }
      />

      {initialMethods.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">No methods found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by creating your first earning method
          </p>
          <Button onClick={handleCreateNew} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Method
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {initialMethods.map((method) => (
            <MethodCard
              key={method.id}
              method={method}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showActions
            />
          ))}
        </div>
      )}

      <MethodFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        method={editingMethod}
      />
    </div>
  )
}
