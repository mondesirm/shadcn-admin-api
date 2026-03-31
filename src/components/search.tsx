import { SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SHORTCUT, useSearch } from '@/context/search-provider'
import { Button } from './ui/button'
import { Kbd } from './ui/kbd'

type SearchProps = {
  className?: string
  placeholder?: string
}

export function Search({ className, placeholder = 'Search...' }: SearchProps) {
  const { setOpen } = useSearch()

  return (
    <Button
      className={cn(
        'group w-full flex-1 gap-2 font-normal text-muted-foreground sm:w-40 @max-sm:hidden',
        className
      )}
      variant='outline'
      onClick={() => setOpen(true)}
    >
      <SearchIcon aria-hidden className='-mx-0.5' size={16} />

      <span>{placeholder}</span>

      <Kbd
        data-icon='inline-end'
        className='ms-auto uppercase group-hover:text-foreground @max-sm:hidden'
      >
        ⌘ {SHORTCUT}
      </Kbd>
    </Button>
  )
}
