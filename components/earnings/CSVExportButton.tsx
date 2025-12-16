'use client'

import { Download } from 'lucide-react'
import { exportEarningsToCSV } from '@/app/actions/csv'
import { useToast } from '@/components/providers/ToastProvider'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export default function CSVExportButton() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const handleExport = async () => {
    setLoading(true)
    try {
      const result = await exportEarningsToCSV()
      
      if (result.success && result.data) {
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        showToast('success', 'Earnings exported successfully')
      } else {
        showToast('error', result.error || 'Export failed')
      }
    } catch (error) {
      showToast('error', 'Failed to export earnings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={loading}>
      <Download className="h-4 w-4 mr-2" />
      {loading ? 'Exporting...' : 'Export CSV'}
    </Button>
  )
}
