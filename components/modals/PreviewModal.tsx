'use client'

import { X, ExternalLink, Clock, DollarSign, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface PreviewModalProps {
  method: any
  onClose: () => void
}

export function PreviewModal({ method, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Preview</h2>
            <Badge variant={method.isActive ? 'success' : 'secondary'}>
              {method.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Method Card Preview */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {method.iconUrl && (
                <img
                  src={method.iconUrl}
                  alt={method.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="text-xl font-bold">{method.title}</h3>
                <span className="text-sm text-gray-600 capitalize">
                  {method.category}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{method.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {method.earnings && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">{method.earnings}</span>
              </div>
            )}
            {method.timeRequired && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>{method.timeRequired}</span>
              </div>
            )}
            {method.difficulty && (
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="capitalize">{method.difficulty}</span>
              </div>
            )}
          </div>

          {method.link && (
            <a
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Learn More
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  )
}
