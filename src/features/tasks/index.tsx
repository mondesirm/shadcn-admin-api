import { Suspense } from 'react'
import { TableProvider } from '@/context/table-provider'
import { DataTableSkeleton } from '@/components/data-table/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { columns } from '@/features/tasks/components/columns'
import { TasksDialogs } from './components/dialogs'
import { TasksPrimaryButtons } from './components/primary-buttons'
import { TasksTable } from './components/table'

export function Tasks() {
  return (
    <TableProvider>
      <Header children={<TasksPrimaryButtons />} fixed />

      <Main>
        <Suspense
          fallback={<DataTableSkeleton columns={columns} />}
          children={<TasksTable />}
        />
      </Main>

      <TasksDialogs />
    </TableProvider>
  )
}
