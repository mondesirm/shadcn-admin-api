import { createFileRoute } from '@tanstack/react-router'
import { AccountSettings } from '@/features/settings/account'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: AccountSettings,
  beforeLoad: () => ({
    getTitle: () => 'Account',
    getDescription: () => 'Manage your account settings',
  }),
})
