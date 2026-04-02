import { SunMoon } from 'lucide-react'
import { modes, themes } from '@/config/themes'
import { SHORTCUT, useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Kbd } from '@/components/ui/kbd'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ThemeSwitch() {
  const { ref, mode, theme, setMode, setTheme } = useTheme()
  const [Light, Dark] = modes.map((m) => (mode === 'system' ? SunMoon : m.icon))

  return (
    <DropdownMenu modal={false}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button ref={ref} size='icon' variant='ghost'>
              <Light className='transition-all duration-500 dark:scale-0 dark:-rotate-180' />
              <Dark className='absolute transition-all duration-500 not-dark:scale-0 not-dark:rotate-180' />
              <span className='sr-only'>Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        <TooltipContent>
          Toggle theme
          <Kbd className='uppercase'>⌘ {SHORTCUT}</Kbd>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent className='w-fit' align='end'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Modes</DropdownMenuLabel>

          {/* @ts-expect-error Non-generic type */}
          <DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
            {modes.map(({ label, value, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {Icon && <Icon />}
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Themes</DropdownMenuLabel>

          {/* @ts-expect-error Non-generic type */}
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            {themes.map(({ label, value, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {Icon && <Icon />}
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
