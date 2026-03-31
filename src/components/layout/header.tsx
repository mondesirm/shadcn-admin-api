import { useEffect, useState } from 'react'
import { Link, useMatches } from '@tanstack/react-router'
import { Home, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ConfigDrawer } from '@/components/config-drawer'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)
  const lastCrumb = [...useMatches()].reverse().find((c) => c.context.getTitle)
  const { getTitle, getDescription } = lastCrumb?.context || {}

  useEffect(() => {
    const onScroll = () => setOffset(document.documentElement.scrollTop)
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-16 transition-shadow',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed && 'shadow',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-4 p-4 **:data-[size=icon]:max-md:scale-125',
          offset > 10 &&
            fixed &&
            'supports-backdrop-filter:bg-background/10 supports-backdrop-filter:backdrop-blur-sm'
        )}
      >
        <SidebarTrigger variant='outline' />

        <Breadcrumb className='min-w-fit' hidden={!getTitle?.().length}>
          <BreadcrumbList>
            <BreadcrumbItem className='max-sm:hidden'>
              <BreadcrumbLink asChild>
                <Link to='/'>
                  <Home className='size-4' />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className='max-sm:hidden' />

            <BreadcrumbPage className='flex items-center gap-2 capitalize'>
              {getTitle?.()}

              <Tooltip>
                <TooltipTrigger hidden={!getDescription?.()} asChild>
                  <Info className='size-4' />
                </TooltipTrigger>

                <TooltipContent>
                  <p>{getDescription?.()}</p>
                </TooltipContent>
              </Tooltip>
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {children}

        <div className='ms-auto flex justify-end gap-4 max-sm:w-full'>
          <Search
            className={cn(
              children && 'max-xs:max-w-fit [&_span]:max-xs:hidden'
            )}
          />

          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </div>
    </header>
  )
}
