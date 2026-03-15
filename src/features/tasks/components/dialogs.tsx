import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/utils'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './import-dialog'
import { TasksMutateDrawer } from './mutate-drawer'
import { useTasks } from './provider'

export function TasksDialogs() {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()

  const onSubmit = () => {
    if (isLoading) return
    setIsLoading(true)

    toast.promise(api.delete(`tasks?id=${currentRow?.id}`), {
      loading: 'Deleting task...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        return 'Deleted task.'
      },
      error: 'Task deletion failed. Please try again.',
      finally: () => setIsLoading(false),
    })
  }

  return (
    <>
      <TasksMutateDrawer
        key='tasks-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`tasks-update-${currentRow.id}`}
            currentRow={currentRow}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => setCurrentRow(null), 500)
            }}
          />

          <ConfirmDialog
            key='tasks-delete'
            className='max-w-md'
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            title={`Delete this task: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
            disabled={!open}
            isLoading={isLoading}
            destructive
            onSubmit={onSubmit}
          />
        </>
      )}
    </>
  )
}
