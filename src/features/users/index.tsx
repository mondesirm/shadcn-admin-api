import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { type User } from './data/schema'

export function Users() {
  const { data, error, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get('users'),
  })

  return (
    <UsersProvider>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Users</h2>
            <p className='text-muted-foreground'>Manage your users here.</p>
          </div>

          <UsersPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <Skeleton className='h-8 w-full rounded-md' />
          ) : error ? (
            <div className='text-red-500'>{error.message}</div>
          ) : (
            <UsersTable data={data!} />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
