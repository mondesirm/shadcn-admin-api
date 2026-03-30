import { useTable } from '@/context/table-provider'
import { type Task } from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

export const useTasks = () => useTable<Task, TasksDialogType>()
