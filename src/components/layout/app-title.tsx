import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '../ui/button'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className='gap-0 py-0 hover:bg-transparent active:bg-transparent'
          size='lg'
          asChild
        >
          <div>
            <Link
              className='grid flex-1 text-start text-sm leading-tight'
              to='/'
              onClick={() => setOpenMobile(false)}
            >
              <span className='truncate font-bold'>Shadcn-Admin</span>
              <span className='truncate text-xs'>Vite + ShadcnUI</span>
            </Link>

            <ToggleSidebar />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ToggleSidebar({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      className={cn('aspect-square size-8 max-md:scale-125', className)}
      size='icon'
      variant='ghost'
      onClick={(e) => {
        onClick?.(e)
        toggleSidebar()
      }}
      {...props}
    >
      <X className='md:hidden' />
      <Menu className='max-md:hidden' />
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  )
}
