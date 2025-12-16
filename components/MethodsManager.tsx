'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Plus, Copy, Trash2, Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MethodFormModal } from '@/components/MethodFormModal'
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal'
import { PreviewModal } from '@/components/modals/PreviewModal'
import { duplicateMethod, deleteMethod } from '@/app/actions/methods'
import { useToast } from '@/components/providers/ToastProvider'
import { useRouter } from 'next/navigation'

interface MethodsManagerProps {
  methods: any[]
}

export function MethodsManager({ methods }: MethodsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'updated'>('updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState<any>(null)
  const [deleteMethodId, setDeleteMethodId] = useState<string | null>(null)
  const [previewMethod, setPreviewMethod] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const itemsPerPage = 10

  // Filter and sort methods
  const filteredMethods = useMemo(() => {
    let filtered = methods

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (method) =>
          method.title.toLowerCase().includes(query) ||
          method.description.toLowerCase().includes(query) ||
          method.category.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((method) => method.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((method) =>
        statusFilter === 'active' ? method.isActive : !method.isActive
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category)
      } else {
        comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [methods, searchQuery, categoryFilter, statusFilter, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredMethods.length / itemsPerPage)
  const paginatedMethods = filteredMethods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const categories = Array.from(new Set(methods.map((m) => m.category)))

  const handleDuplicate = async (method: any) => {
    try {
      const result = await duplicateMethod(method.id)
      if (result.success) {
        showToast('success', 'Method duplicated successfully')
        router.refresh()
      } else {
        showToast('error', result.error || 'Failed to duplicate method')
      }
    } catch (error) {
      showToast('error', 'Failed to duplicate method')
    }
  }

  const handleDelete = async () => {
    if (!deleteMethodId) return

    setIsDeleting(true)
    try {
      const result = await deleteMethod(deleteMethodId)
      if (result.success) {
        showToast('success', 'Method deleted successfully')
        setDeleteMethodId(null)
        router.refresh()
      } else {
        showToast('error', result.error || 'Failed to delete method')
      }
    } catch (error) {
      showToast('error', 'Failed to delete method')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (method: any) => {
    setSelectedMethod(method)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setSelectedMethod(null)
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Methods Manager</h1>
          <p className="text-muted-foreground">
            Manage your earning methods
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Method
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search methods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="updated">Last Updated</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedMethods.length} of {filteredMethods.length} methods
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Last Updated
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedMethods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No methods found
                  </td>
                </tr>
              ) : (
                paginatedMethods.map((method) => (
                  <tr key={method.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{method.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {method.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize">{method.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={method.isActive ? 'success' : 'secondary'}>
                        {method.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(method.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewMethod(method)}
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(method)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicate(method)}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteMethodId(method.id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <MethodFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        method={selectedMethod}
      />

      <DeleteConfirmModal
        isOpen={deleteMethodId !== null}
        onClose={() => setDeleteMethodId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName="method"
      />

      {previewMethod && (
        <PreviewModal
          method={previewMethod}
          onClose={() => setPreviewMethod(null)}
        />
      )}
    </div>
  )
}
