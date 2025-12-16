'use client'

import { useState, useRef } from 'react'
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react'
import { parseCSV, validateCSVRows, type CsvRow } from '@/lib/utils/csv'
import { importEarningsFromCSV } from '@/app/actions/csv'
import { getMethods } from '@/app/actions/methods'
import { useToast } from '@/components/providers/ToastProvider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface CSVImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CSVImportModal({ isOpen, onClose }: CSVImportModalProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [csvData, setCsvData] = useState<CsvRow[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const rows = parseCSV(text)
      setCsvData(rows)
      
      // Validate
      const errors = validateCSVRows(rows)
      setValidationErrors(errors)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      showToast('error', 'Please fix validation errors before importing')
      return
    }

    setImporting(true)
    try {
      // Get all methods to create mapping
      const methodsResult = await getMethods()
      if (!methodsResult.success || !methodsResult.data) {
        showToast('error', 'Failed to load methods')
        return
      }

      // Create method title -> ID map
      const methodIdMap: Record<string, string> = {}
      methodsResult.data.forEach((method) => {
        methodIdMap[method.title] = method.id
      })

      // Import
      const result = await importEarningsFromCSV(csvData, methodIdMap)
      
      if (result.success && result.data) {
        setImportResult(result.data)
        
        if (result.data.success > 0) {
          showToast(
            'success',
            `Successfully imported ${result.data.success} ${result.data.success === 1 ? 'entry' : 'entries'}`
          )
          router.refresh()
        }
        
        if (result.data.failed > 0) {
          showToast(
            'error',
            `${result.data.failed} ${result.data.failed === 1 ? 'entry' : 'entries'} failed to import`
          )
        }
      } else {
        showToast('error', result.error || 'Import failed')
      }
    } catch (error) {
      showToast('error', 'An unexpected error occurred')
    } finally {
      setImporting(false)
    }
  }

  const handleClose = () => {
    setCsvData([])
    setValidationErrors([])
    setImportResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Earnings from CSV">
      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload CSV File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              dark:file:bg-blue-900 dark:file:text-blue-200"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Expected format: Date, Method, Amount, Notes (optional)
          </p>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Validation Errors ({validationErrors.length})
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 max-h-40 overflow-y-auto">
                  {validationErrors.slice(0, 10).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {validationErrors.length > 10 && (
                    <li className="font-medium">... and {validationErrors.length - 10} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {csvData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview ({csvData.length} rows)
            </h4>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-60">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Method</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {csvData.slice(0, 10).map((row, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white whitespace-nowrap">{row.date}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{row.method}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">${row.amount}</td>
                        <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">{row.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {csvData.length > 10 && (
                <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                  Showing first 10 of {csvData.length} rows
                </div>
              )}
            </div>
          </div>
        )}

        {/* Import Result */}
        {importResult && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Import Complete
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p>✅ Successfully imported: {importResult.success}</p>
                  <p>❌ Failed: {importResult.failed}</p>
                </div>
                {importResult.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-sm font-medium text-blue-800 dark:text-blue-200 cursor-pointer">
                      View Errors ({importResult.errors.length})
                    </summary>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1 max-h-40 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose}>
            {importResult ? 'Close' : 'Cancel'}
          </Button>
          {!importResult && (
            <Button
              onClick={handleImport}
              disabled={csvData.length === 0 || validationErrors.length > 0 || importing}
            >
              {importing ? 'Importing...' : `Import ${csvData.length} Entries`}
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400">
          <h5 className="font-medium text-gray-900 dark:text-white mb-2">CSV Format Guide</h5>
          <ul className="space-y-1 text-xs">
            <li>• <strong>Date:</strong> YYYY-MM-DD format (e.g., 2025-12-09)</li>
            <li>• <strong>Method:</strong> Exact method title from your methods list</li>
            <li>• <strong>Amount:</strong> Numeric value (e.g., 25.50)</li>
            <li>• <strong>Notes:</strong> Optional text field</li>
            <li>• Duplicate entries (same user, method, and date) will be skipped</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}
