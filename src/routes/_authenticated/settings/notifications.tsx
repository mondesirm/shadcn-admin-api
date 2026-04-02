import { createFileRoute } from '@tanstack/react-router'
import { SettingsNotifications } from '@/features/settings/notifications'

export const Route = createFileRoute('/_authenticated/settings/notifications')({
  component: SettingsNotifications,
  beforeLoad: () => ({
    getTitle: () => 'Notifications',
    getDescription: () => 'Configure how you receive notifications',
  }),
})
