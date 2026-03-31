import { type LucideIcon, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type PrimaryButtonProps = {
  className?: string
  buttons: {
    title: string
    icon?: LucideIcon
    variant?: 'default' | 'outline'
    onClick: () => void
  }[]
}

export function PrimaryButtons({ className, ...props }: PrimaryButtonProps) {
  return (
    <>
      <div className={cn('flex gap-2 max-sm:hidden', className)} {...props}>
        {props.buttons.map(
          ({ title, icon: Icon, variant = 'default', onClick }) => (
            <Button key={title} variant={variant} onClick={onClick}>
              <span>{title}</span> {Icon && <Icon />}
            </Button>
          )
        )}
      </div>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className='sm:hidden' asChild>
          <Button size='icon' variant='ghost'>
            <Menu />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent {...props}>
          {props.buttons.map(({ title, icon: Icon, onClick }) => (
            <DropdownMenuItem key={title} onSelect={onClick}>
              {Icon && <Icon />}
              {title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
