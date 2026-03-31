import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: {
    title: string
    href: string
    isActive: boolean
    disabled?: boolean
  }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <>
      <div className='lg:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button className='md:size-7' size='icon' variant='outline'>
              <Menu />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {links.map(({ title, href, isActive, disabled }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                <Link
                  className={!isActive ? 'text-muted-foreground' : ''}
                  to={href}
                  disabled={disabled}
                >
                  {title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) => (
          <Link
            key={`${title}-${href}`}
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? '' : 'text-muted-foreground'}`}
            to={href}
            disabled={disabled}
          >
            {title}
          </Link>
        ))}
      </nav>
    </>
  )
}
