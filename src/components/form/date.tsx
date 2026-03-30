import React from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Loader2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { FormControl } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Select, SelectTrigger, SelectValue } from '../ui/select'

type DateInputProps = React.ComponentProps<typeof Calendar> & {
  mode: string
  value?: DateInputProps['selected'] | string | null
  onChange?: (value: DateInputProps['selected'] | string | null) => void
  icon?: LucideIcon
  placeholder?: React.ReactNode
  disabled?: React.ComponentProps<typeof Calendar> | boolean
  isLoading?: boolean
}

export function DateInput({
  value,
  onChange,
  icon: Icon = CalendarIcon,
  placeholder = 'Pick a date',
  isLoading,
  ...props
}: DateInputProps) {
  const formatStr = 'MMM d, yyyy'

  Object.assign(props, { selected: value ?? '', onSelect: onChange })

  if (value instanceof Date || typeof value === 'string')
    value = format(value, formatStr)
  else if (value instanceof Array) {
    value = `${value.length === 1 ? format(value[0], formatStr) : `${value.length} dates selected`}`
  } else if (value) {
    value = `${value.from ? format(value.from, formatStr) : placeholder}
      ${value.from?.getTime() !== value.to?.getTime() ? ` - ${format(value.to!, formatStr)}` : ''}`
  }

  placeholder = (
    <>
      {!isLoading && Icon && <Icon className='opacity-50' />}
      {isLoading && <Loader2 className='animate-spin opacity-50' />}
      {value || placeholder}
    </>
  )

  return (
    <Popover
      {...((props.disabled === true || isLoading) && { open: false })}
      modal
    >
      <Select>
        <PopoverTrigger asChild>
          {/* <InputGroup className='*:cursor-pointer has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 dark:hover:bg-input/50'>
          <InputGroupAddon>
            <Icon className={value ? '' : 'opacity-50'} />
          </InputGroupAddon> */}
          <FormControl>
            {/* <InputGroupInput
              value={value ?? ''}
              className='text-sm'
              placeholder={placeholder}
              disabled={props.disabled === true || isLoading}
              readOnly
            /> */}
            <SelectTrigger className={cn('w-full truncate')}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>

          {/* <InputGroupAddon className='[&>svg]:me-1' align='inline-end'>
            {!value && !isLoading && <ChevronDown />}

            <InputGroupButton
              size='icon-xs'
              disabled={props.disabled === true || isLoading}
              hidden={!value || isLoading}
              disabled={props.disabled === true || isLoading}
              onClick={(e) => {
                e.stopPropagation()
                onChange?.(null)
              }}
            >
              <X />
            </InputGroupButton>

            {isLoading && <Loader2 className='animate-spin' />}
          </InputGroupAddon>
        </InputGroup> */}
        </PopoverTrigger>
      </Select>

      <PopoverContent className='w-auto p-0' align='end'>
        <Calendar captionLayout='dropdown' {...props} />
      </PopoverContent>
    </Popover>
  )
}
