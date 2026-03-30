import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './import-dialog'
import { TasksMutateDrawer } from './mutate-drawer'
import { useTasks } from './provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()

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
            destructive
            onSubmit={() => {
              setOpen(null)
              setTimeout(() => setCurrentRow(null), 500)
              showSubmittedData(
                currentRow,
                'The following task has been deleted:'
              )
            }}
          />
        </>
      )}
    </>
  )
}
