'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserEarnings, createEarningEntry, DailyEarning } from './earnings'
import { parseCSV, validateCSVRows, type CsvRow } from '@/lib/utils/csv'

export type { CsvRow }

export interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}

// Export earnings to CSV format
export async function exportEarningsToCSV(): Promise<ApiResponse<string>> {
  try {
    const result = await getUserEarnings()
    
    if (!result.success || !result.data) {
      return { success: false, error: 'Failed to fetch earnings' }
    }

    const earnings = result.data

    // CSV header
    let csv = 'Date,Method,Category,Amount,Notes\n'

    // CSV rows
    earnings.forEach((earning) => {
      const date = earning.entryDate
      const method = earning.method?.title || 'Unknown'
      const category = earning.method?.category || ''
      const amount = earning.amount.toFixed(2)
      const notes = earning.notes?.replace(/"/g, '""') || '' // Escape quotes

      csv += `"${date}","${method}","${category}","${amount}","${notes}"\n`
    })

    return { success: true, data: csv }
  } catch (error) {
    console.error('Error in exportEarningsToCSV:', error)
    return { success: false, error: 'Failed to export earnings' }
  }
}

// Import earnings from CSV data
export async function importEarningsFromCSV(
  csvData: CsvRow[],
  methodIdMap: Record<string, string> // method title -> method id mapping
): Promise<ApiResponse<ImportResult>> {
  try {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    }

    for (const row of csvData) {
      try {
        // Validate row
        if (!row.date || !row.method || !row.amount) {
          result.failed++
          result.errors.push(`Missing required fields in row: ${JSON.stringify(row)}`)
          continue
        }

        // Get method ID
        const methodId = methodIdMap[row.method]
        if (!methodId) {
          result.failed++
          result.errors.push(`Method not found: ${row.method}`)
          continue
        }

        // Parse amount
        const amount = parseFloat(row.amount)
        if (isNaN(amount) || amount < 0) {
          result.failed++
          result.errors.push(`Invalid amount in row: ${row.amount}`)
          continue
        }

        // Validate date
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(row.date)) {
          result.failed++
          result.errors.push(`Invalid date format: ${row.date}. Expected YYYY-MM-DD`)
          continue
        }

        // Create entry
        const createResult = await createEarningEntry({
          methodId,
          amount,
          entryDate: row.date,
          notes: row.notes,
        })

        if (createResult.success) {
          result.success++
        } else {
          result.failed++
          result.errors.push(`Failed to import row: ${createResult.error}`)
        }
      } catch (error) {
        result.failed++
        result.errors.push(`Unexpected error: ${error}`)
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error in importEarningsFromCSV:', error)
    return { success: false, error: 'Failed to import earnings' }
  }
}
