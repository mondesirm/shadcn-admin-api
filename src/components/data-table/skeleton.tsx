import React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DataTableSkeletonProps<TData> = React.ComponentProps<'div'> & {
  columns?: ColumnDef<TData>[]
  columnCount?: number
  rowCount?: number
  filterCount?: number
  cellWidths?: Record<number, React.CSSProperties['width']>
  advanced?: boolean
  withSearch?: boolean
  withSort?: boolean
  withViewOptions?: boolean
  withPagination?: boolean
  shrinkZero?: boolean
}

export function DataTableSkeleton<TData>({
  columns,
  columnCount = 5,
  rowCount = 10,
  filterCount = 0,
  cellWidths = ['auto'],
  advanced = false,
  withSearch = true,
  withSort = true,
  withViewOptions = true,
  withPagination = true,
  shrinkZero = false,
  className,
  ...props
}: DataTableSkeletonProps<TData>) {
  if (columns?.length) {
    columnCount = columns.length
    // withSearch = columns.some((col) => col.meta?.variant === 'text')
    filterCount = columns.filter((col) => col.enableColumnFilter).length
  }

  const cozyCellWidths = Array.from(
    { length: columnCount },
    (_, index) => cellWidths[index % columnCount] ?? 'auto'
  )

  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}
      {...props}
    >
      <div className='flex w-full items-center justify-between gap-2 overflow-auto'>
        <div className='flex flex-1 items-center gap-2'>
          {!advanced && withSearch && <Skeleton className='h-8 w-40 lg:w-56' />}
          {advanced && withSort && <Skeleton className='h-8 w-18' />}
          {filterCount > 1 &&
            Array.from({ length: advanced ? 1 : filterCount - 1 }).map(
              (_, i) => <Skeleton key={i} className='h-8 w-22' />
            )}
        </div>
        {!advanced && withSort && <Skeleton className='h-8 w-18' />}
        {withViewOptions && <Skeleton className='h-8 w-[6.2rem]' />}
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow key={i} className='hover:bg-transparent'>
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className='h-6 w-full' />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className='hover:bg-transparent'>
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className='h-8 w-full' />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination && (
        <div className='flex w-full items-center justify-between gap-4 overflow-auto sm:gap-8'>
          <Skeleton className='h-8 w-40 shrink-0' />
          <div className='flex items-center gap-4 sm:gap-6 lg:gap-8'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-24' />
              <Skeleton className='h-8 w-18' />
            </div>
            <div className='flex items-center justify-center text-sm font-medium'>
              <Skeleton className='h-8 w-18' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='hidden size-8 lg:block' />
              <Skeleton className='size-8' />
              <Skeleton className='size-8' />
              <Skeleton className='hidden size-8 lg:block' />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
