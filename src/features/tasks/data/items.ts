import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Bug,
  CheckCircle,
  Circle,
  CircleOff,
  Flag,
  HelpCircle,
  Timer,
} from 'lucide-react'
import { type Item } from '@/types/data'

export const labels = [
  { value: 'bug', label: 'Bug', icon: Bug },
  { value: 'feature', label: 'Feature', icon: Flag },
  { value: 'documentation', label: 'Documentation', icon: BookOpen },
] as const satisfies Item[]

export const statuses = [
  { value: 'backlog', label: 'Backlog', icon: HelpCircle },
  { value: 'todo', label: 'Todo', icon: Circle },
  { value: 'in_progress', label: 'In Progress', icon: Timer },
  { value: 'done', label: 'Done', icon: CheckCircle },
  { value: 'canceled', label: 'Canceled', icon: CircleOff },
] as const satisfies Item[]

export const priorities = [
  { value: 'low', label: 'Low', icon: ArrowDown },
  { value: 'medium', label: 'Medium', icon: ArrowRight },
  { value: 'high', label: 'High', icon: ArrowUp },
  { value: 'critical', label: 'Critical', icon: AlertCircle },
] as const satisfies Item[]
