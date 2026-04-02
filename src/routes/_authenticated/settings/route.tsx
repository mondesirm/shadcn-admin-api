import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/features/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
  beforeLoad: () => ({
    getTitle: () => 'Settings',
    getDescription: () => 'Adjust your settings and preferences across devices',
  }),
})
