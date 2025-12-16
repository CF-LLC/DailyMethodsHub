// CSV Utility Functions

export interface CsvRow {
  date: string
  method: string
  amount: string
  notes: string
}

// Parse CSV string to rows
export function parseCSV(csvText: string): CsvRow[] {
  const lines = csvText.trim().split('\n')
  const rows: CsvRow[] = []

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Simple CSV parser (handles quoted fields)
    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    fields.push(current.trim())

    if (fields.length >= 3) {
      rows.push({
        date: fields[0],
        method: fields[1],
        amount: fields[2],
        notes: fields[3] || '',
      })
    }
  }

  return rows
}

// Validate CSV rows before import
export function validateCSVRows(rows: CsvRow[]): string[] {
  const errors: string[] = []
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/

  rows.forEach((row, index) => {
    if (!row.date) {
      errors.push(`Row ${index + 1}: Missing date`)
    } else if (!dateRegex.test(row.date)) {
      errors.push(`Row ${index + 1}: Invalid date format (use YYYY-MM-DD)`)
    }

    if (!row.method) {
      errors.push(`Row ${index + 1}: Missing method`)
    }

    if (!row.amount) {
      errors.push(`Row ${index + 1}: Missing amount`)
    } else {
      const amount = parseFloat(row.amount)
      if (isNaN(amount) || amount < 0) {
        errors.push(`Row ${index + 1}: Invalid amount`)
      }
    }
  })

  return errors
}
