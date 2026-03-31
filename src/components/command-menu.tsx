import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { modes, themes } from '@/config/themes'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { sidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'

export function CommandMenu() {
  const navigate = useNavigate()
  const { open, setOpen } = useSearch()
  const { setMode, setTheme } = useTheme()

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen} modal>
      <CommandInput placeholder='Type a command or search...' />

      <CommandList>
        <ScrollArea className='h-72 pe-1'>
          <CommandEmpty>No results found.</CommandEmpty>

          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url }))
                      }}
                    >
                      <div className='flex size-4 items-center justify-center'>
                        <ArrowRight className='size-2 text-muted-foreground/80' />
                      </div>

                      {navItem.title}
                    </CommandItem>
                  )

                return navItem.items?.map((subItem, i) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${i}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url }))
                    }}
                  >
                    <div className='flex size-4 items-center justify-center'>
                      <ArrowRight className='size-2 text-muted-foreground/80' />
                    </div>

                    {navItem.title} <ChevronRight /> {subItem.title}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading='Mode'>
            {modes.map(({ label, value, icon: Icon }) => (
              <CommandItem
                key={value}
                onSelect={() => runCommand(() => setMode(value))}
              >
                {Icon && <Icon />}
                {label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading='Theme'>
            {themes.map(({ label, value, icon: Icon }) => (
              <CommandItem
                key={value}
                onSelect={() => runCommand(() => setTheme(value))}
              >
                {Icon && <Icon />}
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
