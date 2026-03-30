import { ListCheck, Loader2, type LucideIcon } from 'lucide-react'
import { type Item } from '@/types/data'
import { cn } from '@/lib/utils'
import { FormControl } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SelectInputProps = Omit<React.ComponentProps<typeof Select>, 'value'> & {
  value?: string | null
  onChange?: (value: string) => void
  className?: string
  icon?: LucideIcon
  placeholder?: React.ReactNode
  items?: Item[]
  isLoading?: boolean
}

export function SelectInput({
  className,
  value,
  onChange: onValueChange,
  icon: Icon = ListCheck,
  placeholder = 'Select an option',
  items,
  disabled,
  isLoading,
  ...props
}: SelectInputProps) {
  value ??= undefined

  const field = { value, onValueChange }

  placeholder = (
    <>
      {!isLoading && Icon && <Icon className='opacity-50' />}
      {isLoading && <Loader2 className='animate-spin opacity-50' />}
      {placeholder}
    </>
  )

  return (
    <Select {...field} disabled={disabled || isLoading} {...props}>
      <FormControl>
        <SelectTrigger className={cn('w-full truncate', className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>

      <SelectContent>
        <SelectGroup>
          {items?.map(({ label, value, icon: ItemIcon = Icon }) => (
            <SelectItem key={value} value={value}>
              {ItemIcon && <ItemIcon />}
              {label || value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
