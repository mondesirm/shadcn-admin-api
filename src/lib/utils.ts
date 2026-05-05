import axios, { type Method } from 'axios'
import { type ClassValue, clsx } from 'clsx'
import { type Prisma } from 'generated/prisma/client'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5 // Maximum number of page buttons to show
  const rangeWithDots = []

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i)
    }
  } else {
    // Always show first page
    rangeWithDots.push(1)

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    }
  }

  return rangeWithDots
}

// TODO incorrectly imports when a field is empty
export function fromCSV(csv: string | File): Promise<Record<string, string>[]> {
  if (csv instanceof File) {
    const reader = new FileReader()
    reader.readAsText(csv)

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(fromCSV(reader.result))
        else reject(new Error('Failed to read file'))
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
    })
  }

  // Basic CSV parsing (no quoted fields, etc.)
  const lines = csv.split('\n').filter((l) => l.trim() !== '')
  const headers = lines[0].split(',').map((h) => h.trim())

  const parsedRows = lines.slice(1).map((l) => {
    const cells = l.split(',').map((v) => v.trim())

    return headers.reduce((acc, h, i) => {
      ;(acc as Record<string, string>)[h] = cells[i]
      return acc
    }, {})
  })

  return new Promise((resolve) => resolve(parsedRows))
}

export function toCSV(
  data: Record<string, unknown>[],
  filename: string = 'data'
): string {
  if (!data || data.length === 0) return ''

  filename = filename.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase()

  const headers = Array.from(
    data.reduce<Set<string>>((acc, row) => {
      Object.keys(row).forEach((k) => acc.add(k))
      return acc
    }, new Set())
  )

  const escape = (value: unknown) => {
    const str = String(value ?? '')
    if (!value) return ''
    if (['"', ',', '\n'].includes(str)) return `"${str.replace(/"/g, '""')}"`
    return str
  }

  const lines = [
    headers.join(','),
    ...data.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ]

  const csv = lines.join('\n')

  // If running in a browser, trigger a download; always return the CSV string.
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return csv
}

type Base = `${Lowercase<Prisma.ModelName>}s`
type Path = Base | `${Base}/${number | ''}`
type Prop = symbol | Lowercase<Method> | 'import' | 'export'
type Result<T> = T extends 'get' ? object[] : { count: number }

/**
 * Small helper that proxies axios HTTP-based methods
 *
 * The `import` method parses a CSV file or string into an array of objects
 */
export const api = new Proxy(axios, {
  get: (target, prop: Prop) => async (path: Path, data?: unknown) => {
    if (typeof prop === 'symbol') throw new Error('Symbol not supported')
    if (prop === 'import') data = await fromCSV(data as File)
    if (prop === 'export') return toCSV(data as Record<string, unknown>[], path)
    const method = prop === 'import' ? 'post' : prop
    return target(`/api/${path}`, { method, data }).then((res) => res.data)
  },
}) as unknown as {
  [M in Prop]: <D = unknown, R = Result<M>>(path: Path, data?: D) => Promise<R>
}
