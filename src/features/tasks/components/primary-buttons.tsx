import { Plus, Upload } from 'lucide-react'
import { PrimaryButtons } from '@/components/primary-buttons'
import { useTasks } from './provider'

export function TasksPrimaryButtons() {
  const { setOpen } = useTasks()

  const buttons = [
    { title: 'Create', icon: Plus, onClick: () => setOpen('create') },
    {
      title: 'Import',
      icon: Upload,
      variant: 'outline' as const,
      onClick: () => setOpen('import'),
    },
  ]

  return <PrimaryButtons buttons={buttons} />
}
