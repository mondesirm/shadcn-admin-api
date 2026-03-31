'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { api } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Task } from '../data/schema'

type TasksBulkDeleteDialogProps<TData> = {
  table: Table<TData>
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CONFIRM_WORD = 'DELETE'

export function TasksBulkDeleteDialog<TData>({
  table,
  open,
  onOpenChange: setOpen,
}: TasksBulkDeleteDialogProps<TData>) {
  const queryClient = useQueryClient()
  const [value, onChange] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { length, ...selectedRows } = table.getFilteredSelectedRowModel().rows

  const onOpenChange = (v: boolean) => {
    setOpen(v)
    onChange('')
  }

  const onSubmit = () => {
    if (isLoading) return
    setIsLoading(true)

    if (value.trim() !== CONFIRM_WORD)
      return toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)

    toast.promise(
      api.delete<Task.Bulk['delete']>(
        'tasks',
        selectedRows.map((row) => (row.original as Task).id)
      ),
      {
        loading: 'Deleting tasks...',
        success: ({ count }) => {
          onOpenChange(false)
          table.resetRowSelection()
          queryClient.invalidateQueries({ queryKey: ['tasks'] })
          return `Deleted ${count} task${count > 1 ? 's' : ''}.`
        },
        error: 'Bulk task deletion failed. Please try again.',
        finally: () => setIsLoading(false),
      }
    )
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
