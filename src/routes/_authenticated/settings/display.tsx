import { createFileRoute } from '@tanstack/react-router'
import { DisplaySettings } from '@/features/settings/display'

export const Route = createFileRoute('/_authenticated/settings/display')({
  component: DisplaySettings,
  beforeLoad: () => ({
    getTitle: () => 'Display',
    getDescription: () => 'Control what items are displayed',
  }),
})
