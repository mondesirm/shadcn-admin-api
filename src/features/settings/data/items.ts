import { type FileRoutesByTo } from '@/routeTree.gen'
import { UserCog, Wrench, Palette, Bell, Monitor } from 'lucide-react'
import { type Item } from '@/types/data'
import { sidebarData } from '@/components/layout/data/sidebar-data'

export const paths = [
  { value: '/settings', label: 'Profile', icon: UserCog },
  { value: '/settings/account', label: 'Account', icon: Wrench },
  { value: '/settings/appearance', label: 'Appearance', icon: Palette },
  { value: '/settings/notifications', label: 'Notifications', icon: Bell },
  { value: '/settings/display', label: 'Display', icon: Monitor },
] as const satisfies Item<keyof FileRoutesByTo>[]

export const notifications = [
  { value: 'all', label: 'All' },
  { value: 'mentions', label: 'Mentions' },
  { value: 'none', label: 'None' },
] as const satisfies Item[]

// TODO remove
// export const sidebar = [
//   { value: 'recents', label: 'Recents' },
//   { value: 'home', label: 'Home' },
//   { value: 'applications', label: 'Applications' },
//   { value: 'desktop', label: 'Desktop' },
//   { value: 'downloads', label: 'Downloads' },
//   { value: 'documents', label: 'Documents' },
// ] as const satisfies Item[]

// TODO include navGroup title to add it as a section header in the form
export const sidebar = sidebarData.navGroups.flatMap((group) =>
  group.items.map((item) => ({
    value: item.url ?? '',
    label: item.title,
    icon: item.icon,
  }))
)
