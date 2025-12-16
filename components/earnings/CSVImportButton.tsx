'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import CSVImportModal from './CSVImportModal'

export default function CSVImportButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setIsModalOpen(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Import CSV
      </Button>
      <CSVImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
