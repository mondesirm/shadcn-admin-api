import { useState } from 'react'
import { useLocation, useNavigate, Link } from '@tanstack/react-router'
import { type Item } from '@/types/data'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SidebarNavProps = React.ComponentProps<'nav'> & {
  items: Item[]
}

// TODO use SelectInput and maybe move it inside the header
export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [value, setValue] = useState(pathname ?? '/settings')

  const onValueChange = (to: string) => {
    setValue(to)
    navigate({ to })
  }

  return (
    <>
      <div className='p-1 md:hidden'>
        <Select {...{ value, onValueChange }}>
          <SelectTrigger className='h-12 sm:w-48'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>

          <SelectContent>
            {items.map(({ value, label, icon: Icon }) => (
              <SelectItem key={value} value={value}>
                <div className='flex gap-x-4 px-2 py-1'>
                  {Icon && <Icon />}
                  {label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        className='hidden w-full min-w-40 bg-background px-1 py-2 md:block'
        type='always'
      >
        <nav
          className={cn(
            'flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0',
            className
          )}
          {...props}
        >
          {items.map(({ value, label, icon: Icon }) => (
            <Link
              key={value}
              to={value}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                pathname === value
                  ? 'bg-muted hover:bg-accent'
                  : 'hover:bg-accent hover:underline',
                'justify-start'
              )}
            >
              {Icon && <Icon />}
              {label}
            </Link>
          ))}
        </nav>

        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </>
  )
}
