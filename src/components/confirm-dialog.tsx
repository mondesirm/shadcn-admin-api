import { AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type ConfirmDialogProps = React.ComponentProps<typeof AlertDialogContent> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  desc: React.ReactNode
  cancelText?: React.ReactNode
  confirmText?: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
  destructive?: boolean
  onSubmit: () => void
}

export function ConfirmDialog({
  className,
  open,
  onOpenChange,
  title,
  desc,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  children,
  destructive,
  isLoading,
  disabled = false,
  onSubmit,
  ...props
}: ConfirmDialogProps) {
  return (
    <AlertDialog {...{ open, onOpenChange }}>
      <AlertDialogContent className={cn('@container', className)} {...props}>
        <AlertDialogHeader className='text-start'>
          <AlertDialogTitle className={destructive ? 'text-destructive' : ''}>
            {destructive && <AlertTriangle className='me-2 inline size-4' />}
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>

        {children}

        <AlertDialogFooter className='grid gap-4 @2xs:grid-cols-2'>
          <AlertDialogCancel asChild>
            <Button variant='outline'>{cancelText}</Button>
          </AlertDialogCancel>

          <Button
            {...(destructive && { variant: 'destructive' })}
            disabled={disabled || isLoading}
            onClick={onSubmit}
          >
            {confirmText}
            {isLoading && <Loader2 className='animate-spin' />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
