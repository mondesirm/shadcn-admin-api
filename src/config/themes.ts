import { Cat, Moon, RectangleHorizontal, Sun, SunMoon } from 'lucide-react'
import { type Item } from '@/types/data'

export const modes = [
  { value: 'system', label: 'System', icon: SunMoon },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const satisfies Item[]

export const themes = [
  { value: 'nova', label: 'Nova', icon: RectangleHorizontal },
  { value: 'catppuccin', label: 'Catppuccin', icon: Cat },
] as const satisfies Item[]
