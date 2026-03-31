import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AtSign, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/utils'
import { useDirection } from '@/context/direction-provider'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { DateInput } from '@/components/form/date'
import { Input } from '@/components/form/input'
import { SelectInput } from '@/components/form/select'
import { labels, priorities, statuses } from '../data/items'
import { Task } from '../data/schema'

type TaskMutateDrawerProps = {
  currentRow?: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksMutateDrawer({
  currentRow,
  open,
  onOpenChange: setOpen,
}: TaskMutateDrawerProps) {
  const isUpdate = !!currentRow
  const { dir } = useDirection()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<Task.Form>({
    resolver: zodResolver(Task.Form),
    defaultValues: currentRow,
  })

  const onOpenChange = (v: boolean) => {
    setOpen(v)
    form.reset()
  }

  const onSubmit = (task: Task.Form) => {
    if (isLoading) return
    setIsLoading(true)

    toast.promise(
      api[isUpdate ? 'put' : 'post'](`tasks/${currentRow?.id || ''}`, task),
      {
        loading: (isUpdate ? 'Updating' : 'Creating') + ' task...',
        success: () => {
          onOpenChange(false)
          queryClient.invalidateQueries({ queryKey: ['tasks'] })
          return `Task ${isUpdate ? 'updated' : 'created'} successfully!`
        },
        error: `Task ${isUpdate ? 'update' : 'creation'} failed. Please try again.`,
        finally: () => setIsLoading(false),
      }
    )
  }

  return (
    <Sheet {...{ open, onOpenChange }}>
      <SheetContent
        className='@container gap-0 max-xs:w-full!'
        {...(dir === 'rtl' && { side: 'left' })}
      >
        <SheetHeader>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>

          <SheetDescription>
            {isUpdate ? 'Update the' : 'Add a new'} task by providing necessary
            info. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='tasks-form'
            className='flex-1 space-y-4 overflow-y-auto px-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name='title'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className='truncate *:contents'>
                    <FormLabel>Title</FormLabel> <FormMessage />
                  </div>

                  <Input
                    {...field}
                    placeholder='Enter a title'
                    maxLength={100}
                  />
                </FormItem>
              )}
            />

            <div className='grid items-start gap-4 @xs:grid-cols-2'>
              <FormField
                name='label'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className='truncate *:contents'>
                      <FormLabel>Label</FormLabel> <FormMessage />
                    </div>

                    <SelectInput {...field} items={labels} />
                  </FormItem>
                )}
              />

              <FormField
                name='status'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className='truncate *:contents'>
                      <FormLabel>Status</FormLabel> <FormMessage />
                    </div>

                    <SelectInput {...field} items={statuses} />
                  </FormItem>
                )}
              />

              <FormField
                name='priority'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className='truncate *:contents'>
                      <FormLabel>Priority</FormLabel> <FormMessage />
                    </div>

                    <SelectInput {...field} items={priorities} />
                  </FormItem>
                )}
              />

              <FormField
                name='dueDate'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className='truncate *:contents'>
                      <FormLabel>Due Date</FormLabel> <FormMessage />
                    </div>

                    <DateInput
                      {...field}
                      mode='single'
                      disabled={{ before: new Date() }}
                    />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name='assignee'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className='truncate *:contents'>
                    <FormLabel>Assignee</FormLabel> <FormMessage />
                  </div>

                  <Input
                    {...field}
                    icon={AtSign}
                    placeholder='Enter an assignee'
                  />
                </FormItem>
              )}
            />

            <FormField
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className='truncate *:contents'>
                    <FormLabel>Description</FormLabel> <FormMessage />
                  </div>

                  <Input
                    {...field}
                    type='textarea'
                    placeholder='Enter a description'
                    maxLength={300}
                  />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className='grid gap-4 @xs:grid-cols-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>

          <Button type='submit' form='tasks-form' disabled={!open || isLoading}>
            Save changes
            {isLoading && <Loader2 className='animate-spin' />}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
