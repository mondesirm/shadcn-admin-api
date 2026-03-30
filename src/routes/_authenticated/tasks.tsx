import { createFileRoute } from '@tanstack/react-router'
import { GeneralError } from '@/features/errors/general-error'
import { Tasks } from '@/features/tasks'
import { tasks } from '@/features/tasks/data/mock'
import { Params } from '@/features/tasks/data/schema'

export const Route = createFileRoute('/_authenticated/tasks')({
  validateSearch: Params,
  beforeLoad: () => ({
    getTitle: () => 'Tasks',
    getDescription: () => 'Manage your tasks',
  }),
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery({
      queryKey: ['tasks'],
      queryFn: () => tasks,
    })
  },
  component: Tasks,
  errorComponent: GeneralError,
})
