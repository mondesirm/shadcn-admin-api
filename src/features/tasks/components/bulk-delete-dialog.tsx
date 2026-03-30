'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type TasksBulkDeleteDialogProps<TData> = {
  table: Table<TData>
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CONFIRM_WORD = 'DELETE'

export function TasksBulkDeleteDialog<TData>({
  table,
  open,
  onOpenChange,
}: TasksBulkDeleteDialogProps<TData>) {
  const [value, onChange] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { length } = table.getFilteredSelectedRowModel().rows

  onOpenChange = (v) => {
    onOpenChange(v)
    onChange('')
  }

  const onSubmit = () => {
    if (isLoading) return
    setIsLoading(true)

    if (value.trim() !== CONFIRM_WORD)
      return toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)

    toast.promise(sleep(2000), {
      loading: 'Deleting tasks...',
      success: () => {
        onOpenChange(false)
        table.resetRowSelection()
        return `Deleted ${length} task${length > 1 ? 's' : ''}`
      },
      error: 'Bulk task deletion failed. Please try again.',
      finally: () => setIsLoading(false),
    })
  }

  return (
    <ConfirmDialog
      {...{ open, onOpenChange, onSubmit }}
      title={`Delete ${length} task${length > 1 ? 's' : ''}`}
      desc={
        <div className='space-y-4'>
          <p>
            Are you sure you want to delete the selected task
            {length > 1 ? 's' : ''}? <br />
            This action cannot be undone.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>Confirm by typing "{CONFIRM_WORD}":</span>

            <Input
              value={value}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              onChange={(e) => onChange(e.target.value)}
            />
          </Label>
        </div>
      }
      confirmText='Delete'
      disabled={value.trim() !== CONFIRM_WORD}
      isLoading={!open || isLoading}
      destructive
    />
  )
}
