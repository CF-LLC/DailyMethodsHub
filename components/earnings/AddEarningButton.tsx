'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import AddEarningModal from './AddEarningModal'

export default function AddEarningButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="h-5 w-5 mr-2" />
        Add Earning
      </Button>
      <AddEarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
