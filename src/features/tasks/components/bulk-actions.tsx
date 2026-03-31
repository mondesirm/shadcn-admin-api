import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import {
  ArrowUpDown,
  CircleArrowUp,
  Copy,
  Download,
  Tag,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions } from '@/components/data-table'
import { labels, priorities, statuses } from '../data/items'
import { type Task } from '../data/schema'
import { TasksBulkDeleteDialog } from './bulk-delete-dialog'

type TasksTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function TasksTableBulkActions<TData>({
  table,
}: TasksTableBulkActionsProps<TData>) {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const [openDeleteDialog, onOpenDeleteDialog] = useState(false)
  const selectedTasks = selectedRows.map((row) => row.original as Task)
  const ids = selectedTasks.map((task) => task.id)

  const onUpdate = <T extends keyof Task>(k: T, v: Task[T]) => {
    if (isLoading) return
    setIsLoading(true)

    toast.promise(api.put<Task.Bulk['update']>('tasks', { [k]: v, ids }), {
      loading: `Updating ${k}...`,
      success: ({ count }) => {
        table.resetRowSelection()
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        return `Updated ${k} to ${v} for ${count} task${count > 1 ? 's' : ''}.`
      },
      error: 'Bulk task update failed. Please try again.',
      finally: () => setIsLoading(false),
    })
  }

  const onDuplicate = () => {
    if (isLoading) return
    setIsLoading(true)

    toast.promise(api.post<Task.Bulk['create']>('tasks', selectedTasks), {
      loading: `Duplicating tasks...`,
      success: ({ count }) => {
        table.resetRowSelection()
        return `Duplicated ${count} task${count > 1 ? 's' : ''}.`
      },
      error: 'Bulk task duplication failed. Please try again.',
      finally: () => setIsLoading(false),
    })
  }

  const onExport = () => {
    if (isLoading) return
    setIsLoading(true)

    toast.promise(api.export('tasks', selectedTasks), {
      loading: `Exporting tasks to CSV...`,
      success: ({ count }) => {
        table.resetRowSelection()
        return `Exported ${count} task${count > 1 ? 's' : ''} to CSV.`
      },
      error: 'Bulk task export failed. Please try again.',
      finally: () => setIsLoading(false),
    })
  }

  return (
    <DataTableBulkActions table={table} entityName='task'>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='outline'>
                <Tag />
                <span className='sr-only'>Update label</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent>
            <p>Update label</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent sideOffset={14}>
          {labels.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem
              key={value}
              defaultValue={value}
              onClick={() => onUpdate('label', value)}
            >
              {Icon && <Icon />}
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='outline'>
                <CircleArrowUp />
                <span className='sr-only'>Update status</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent>
            <p>Update status</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent sideOffset={14}>
          {statuses.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem
              key={value}
              defaultValue={value}
              onClick={() => onUpdate('status', value)}
            >
              {Icon && <Icon />}
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='outline'>
                <ArrowUpDown />
                <span className='sr-only'>Update priority</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          <TooltipContent>
            <p>Update priority</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent sideOffset={14}>
          {priorities.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem
              key={value}
              defaultValue={value}
              onClick={() => onUpdate('priority', value)}
            >
              {Icon && <Icon />}
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator className='h-6' orientation='vertical' />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size='icon' variant='secondary' onClick={onDuplicate}>
            <Copy />
            <span className='sr-only'>Duplicate</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>Duplicate</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size='icon' variant='secondary' onClick={onExport}>
            <Download />
            <span className='sr-only'>Export</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>Export</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            variant='destructive'
            onClick={() => onOpenDeleteDialog(true)}
          >
            <Trash2 />
            <span className='sr-only'>Delete</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>

      <TasksBulkDeleteDialog
        table={table}
        open={openDeleteDialog}
        onOpenChange={onOpenDeleteDialog}
      />
    </DataTableBulkActions>
  )
}
