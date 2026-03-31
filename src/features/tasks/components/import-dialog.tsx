import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input as Input2 } from '@/components/form/input'
import { Task } from '../data/schema'

type TasksImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog({
  open,
  onOpenChange: setOpen,
}: TasksImportDialogProps) {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<Task.Import>({
    resolver: zodResolver(Task.Import),
  })

  const { onBlur, ...fileRef } = form.register('file')

  const onOpenChange = (v: boolean) => {
    setOpen(v)
    form.reset()
  }

  // TODO multi-step with preview of parsed tasks and option to map columns to fields
  const onSubmit = ({ file }: Task.Import) => {
    if (isLoading) return
    setIsLoading(true)

    toast.promise(api.import('tasks', file[0]), {
      loading: `Importing tasks from ${file[0].name}...`,
      success: ({ count }) => {
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        return `Imported ${count} task${count === 1 ? '' : 's'}.`
      },
      error: 'Task import failed. Please try again.',
      finally: () => setIsLoading(false),
    })
  }

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>Import Tasks</DialogTitle>

          <DialogDescription>
            Import tasks quickly from a CSV file.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='tasks-import-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name='file'
              control={form.control}
              render={() => (
                <FormItem className='my-2'>
                  <div className='truncate *:contents'>
                    <FormLabel>File</FormLabel> <FormMessage />
                  </div>

                  <Input2 {...fileRef} type='file' accept='text/csv' />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className='grid grid-cols-2 gap-4'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>

          <Button
            type='submit'
            form='tasks-import-form'
            disabled={!open || isLoading}
          >
            Import
            {isLoading && <Loader2 className='animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
