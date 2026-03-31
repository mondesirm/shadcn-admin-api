import { type SVGProps } from 'react'
import { Root as Radio, Item } from '@radix-ui/react-radio-group'
import { CircleCheck, RotateCcw, Settings2 } from 'lucide-react'
import { IconDir } from '@/assets/custom/icon-dir'
import { IconLayoutCompact } from '@/assets/custom/icon-layout-compact'
import { IconLayoutDefault } from '@/assets/custom/icon-layout-default'
import { IconLayoutFull } from '@/assets/custom/icon-layout-full'
import { IconModeDark } from '@/assets/custom/icon-mode-dark'
import { IconModeLight } from '@/assets/custom/icon-mode-light'
import { IconModeSystem } from '@/assets/custom/icon-mode-system'
import { IconSidebarFloating } from '@/assets/custom/icon-sidebar-floating'
import { IconSidebarInset } from '@/assets/custom/icon-sidebar-inset'
import { IconSidebarSidebar } from '@/assets/custom/icon-sidebar-sidebar'
import { cn } from '@/lib/utils'
import { useDirection } from '@/context/direction-provider'
import { type Collapsible, useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSidebar } from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ConfigDrawer() {
  const { resetMode } = useTheme()
  const { setOpen } = useSidebar()
  const { resetLayout } = useLayout()
  const { dir, resetDir } = useDirection()

  const handleReset = () => {
    resetMode()
    setOpen(true)
    resetLayout()
    resetDir()
  }

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              aria-label='Open site preferences'
              aria-describedby='config-drawer-description'
              className='rounded-full'
              size='icon'
              variant='ghost'
            >
              <Settings2 aria-hidden />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>

        <TooltipContent>
          <p>Open site preferences</p>
        </TooltipContent>
      </Tooltip>

      <SheetContent
        className='flex flex-col'
        {...(dir === 'rtl' && { side: 'left' })}
      >
        <SheetHeader className='pb-0 text-start'>
          <SheetTitle>Site Preferences</SheetTitle>

          <SheetDescription id='config-drawer-description'>
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>

        <div className='space-y-6 overflow-y-auto px-4'>
          <ModeConfig />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
        </div>

        <SheetFooter className='gap-2'>
          <Button
            aria-label='Reset all settings to default values'
            variant='destructive'
            onClick={handleReset}
          >
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

type SectionTitleProps = {
  className?: string
  title: string
  showReset?: boolean
  onReset?: () => void
}

function SectionTitle({
  className,
  title,
  showReset,
  onReset,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-2 font-semibold text-muted-foreground',
        className
      )}
    >
      {title}

      {showReset && onReset && (
        <Button
          className='size-4 rounded-full'
          size='icon'
          variant='secondary'
          onClick={onReset}
        >
          <RotateCcw className='size-3 rtl:rotate-180' />
        </Button>
      )}
    </div>
  )
}

type RadioGroupItemProps = {
  item: {
    value: string
    label: string
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
  }
  isMode?: boolean
}

function RadioGroupItem({ item, isMode }: RadioGroupItemProps) {
  return (
    <Item
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
      className={cn('group outline-none', 'transition duration-200 ease-in')}
      value={item.value}
    >
      <div
        className={cn(
          'relative rounded-[6px] ring-[1px] ring-border',
          'group-data-[state=checked]:shadow-2xl group-data-[state=checked]:ring-primary',
          'group-focus-visible:ring-2'
        )}
        role='img'
        aria-hidden='false'
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            'size-6 fill-foreground stroke-background',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden='true'
        />

        <item.icon
          className={cn(
            !isMode &&
              'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground'
          )}
          aria-hidden='true'
        />
      </div>

      <div
        className='mt-1 text-xs'
        id={`${item.value}-description`}
        aria-live='polite'
      >
        {item.label}
      </div>
    </Item>
  )
}

function ModeConfig() {
  const { defaultMode, mode, setMode } = useTheme()

  return (
    <div>
      <SectionTitle
        title='Mode'
        showReset={mode !== defaultMode}
        onReset={() => setMode(defaultMode)}
      />

      <Radio
        aria-label='Select mode preference'
        aria-describedby='mode-description'
        className='grid w-full max-w-md grid-cols-3 gap-4'
        value={mode}
        onValueChange={setMode}
      >
        {[
          { value: 'system', label: 'System', icon: IconModeSystem },
          { value: 'light', label: 'Light', icon: IconModeLight },
          { value: 'dark', label: 'Dark', icon: IconModeDark },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isMode />
        ))}
      </Radio>

      <div id='mode-description' className='sr-only'>
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  )
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Sidebar'
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
      />

      <Radio
        aria-label='Select sidebar style'
        aria-describedby='sidebar-description'
        className='grid w-full max-w-md grid-cols-3 gap-4'
        value={variant}
        onValueChange={setVariant}
      >
        {[
          {
            value: 'inset',
            label: 'Inset',
            icon: IconSidebarInset,
          },
          {
            value: 'floating',
            label: 'Floating',
            icon: IconSidebarFloating,
          },
          {
            value: 'sidebar',
            label: 'Sidebar',
            icon: IconSidebarSidebar,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>

      <div id='sidebar-description' className='sr-only'>
        Choose between inset, floating, or standard sidebar layout
      </div>
    </div>
  )
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar()
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout()

  const radioState = open ? 'default' : collapsible

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Layout'
        showReset={radioState !== 'default'}
        onReset={() => {
          setOpen(true)
          setCollapsible(defaultCollapsible)
        }}
      />

      <Radio
        value={radioState}
        onValueChange={(v) => {
          if (v === 'default') return setOpen(true)
          setOpen(false)
          setCollapsible(v as Collapsible)
        }}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select layout style'
        aria-describedby='layout-description'
      >
        {[
          {
            value: 'default',
            label: 'Default',
            icon: IconLayoutDefault,
          },
          {
            value: 'icon',
            label: 'Compact',
            icon: IconLayoutCompact,
          },
          {
            value: 'offcanvas',
            label: 'Full layout',
            icon: IconLayoutFull,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>

      <div id='layout-description' className='sr-only'>
        Choose between default expanded, compact icon-only, or full layout mode
      </div>
    </div>
  )
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection()

  return (
    <div>
      <SectionTitle
        title='Direction'
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
      />

      <Radio
        aria-label='Select site direction'
        aria-describedby='direction-description'
        className='grid w-full max-w-md grid-cols-3 gap-4'
        value={dir}
        onValueChange={setDir}
      >
        {[
          {
            value: 'ltr',
            label: 'Left to Right',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='ltr' {...props} />
            ),
          },
          {
            value: 'rtl',
            label: 'Right to Left',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='rtl' {...props} />
            ),
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>

      <div id='direction-description' className='sr-only'>
        Choose between left-to-right or right-to-left site direction
      </div>
    </div>
  )
}
