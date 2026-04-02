import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { CircleArrowUp, Download, Trash2, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
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
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { roles, statuses } from '../data/enums'
import { type User } from '../data/schema'
import { UsersBulkDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkMutate = <T extends keyof User>(k: T, v: User[T]) => {
    const selectedUsers = selectedRows.map((row) => row.original as User)

    toast.promise(sleep(2000), {
      loading: `Updating ${k}...`,
      success: () => {
        table.resetRowSelection()
        return `Updated ${k} to ${v} for ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}.`
      },
      error: 'Bulk user update failed. Please try again.',
    })
  }

  const handleBulkExport = () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)

    toast.promise(sleep(2000), {
      loading: 'Exporting users...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} to CSV.`
      },
      error: 'User export failed. Please try again.',
    })
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='user'>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label='Update role'
                  className='size-8'
                  title='Update role'
                  size='icon'
                  variant='outline'
                >
                  <UserCog />
                  <span className='sr-only'>Update role</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>

            <TooltipContent>
              <p>Update role</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent sideOffset={14}>
            {roles.map(({ label, value, icon: Icon }) => (
              <DropdownMenuItem
                key={value}
                defaultValue={value}
                onClick={() => handleBulkMutate('role', value)}
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
                <Button
                  aria-label='Update status'
                  className='size-8'
                  title='Update status'
                  size='icon'
                  variant='outline'
                >
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
            {statuses.map(({ label, value, icon: Icon }) => (
              <DropdownMenuItem
                key={value}
                defaultValue={value}
                onClick={() => handleBulkMutate('status', value)}
              >
                {Icon && <Icon />}
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator className='h-5' orientation='vertical' aria-hidden='true' />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label='Export selected users'
              className='size-8'
              title='Export selected users'
              size='icon'
              variant='outline'
              onClick={handleBulkExport}
            >
              <Download />
              <span className='sr-only'>Export selected users</span>
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Export selected users</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label='Delete selected users'
              className='size-8'
              title='Delete selected users'
              size='icon'
              variant='destructive'
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 />
              <span className='sr-only'>Delete selected users</span>
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Delete selected users</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersBulkDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
