import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DataTableViewOptions,
  DataTableColumnHeader as Header,
} from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { labels, priorities, statuses } from '../data/items'
import { type Task } from '../data/schema'
import { TasksTableRowActions } from './row-actions'

// TODO cellWidths={{ 2: '45%' }}
export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label='Select all'
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label='Select row'
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
    meta: { className: 'start-0 z-10 rounded-tl-[inherit] max-md:sticky' },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <Header column={column} title='Task' />,
    cell: ({ row }) => <div className='ps-3'>{row.getValue('id')}</div>,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0/0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255/0.1)]',
        'start-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <Header column={column} title='Title' />,
    cell: ({ row }) => <LongText>{row.getValue('title')}</LongText>,
    meta: { className: 'ps-1 max-w-60', tdClassName: 'ps-4' },
  },
  {
    accessorKey: 'label',
    header: ({ column }) => <Header column={column} title='Label' />,
    cell: ({ row }) =>
      labels
        .filter((_) => _.value === row.getValue('label'))
        .map(({ value, label, icon: Icon }) => (
          <Badge key={value} variant='outline'>
            {Icon && <Icon className='size-4 text-muted-foreground' />}
            <span>{label || value}</span>
          </Badge>
        )),
    filterFn: 'arrIncludes',
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <Header column={column} title='Status' />,
    cell: ({ row }) =>
      statuses
        .filter((_) => _.value === row.getValue('status'))
        .map(({ value, label, icon: Icon }) => (
          <Badge key={value} variant='outline'>
            {Icon && <Icon className='size-4 text-muted-foreground' />}
            <span>{label || value}</span>
          </Badge>
        )),
    filterFn: 'arrIncludes',
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <Header column={column} title='Priority' />,
    cell: ({ row }) =>
      priorities
        .filter((_) => _.value === row.getValue('priority'))
        .map(({ value, label, icon: Icon }) => (
          <Badge key={value} variant='outline'>
            {Icon && <Icon className='size-4 text-muted-foreground' />}
            <span>{label || value}</span>
          </Badge>
        )),
    filterFn: 'arrIncludes',
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
  },
  {
    id: 'actions',
    header: DataTableViewOptions,
    cell: TasksTableRowActions,
    meta: { className: cn('end-0 z-10 rounded-tl-[inherit] max-md:sticky') },
  },
]
