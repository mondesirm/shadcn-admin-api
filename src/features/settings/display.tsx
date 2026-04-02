import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { sidebar } from './data/items'
import { DisplayForm } from './data/schema'
import { display } from './data/settings'

export function DisplaySettings() {
  const form = useForm<DisplayForm>({
    resolver: zodResolver(DisplayForm),
    defaultValues: display,
  })

  const onSubmit = (data: DisplayForm) => showSubmittedData(data)

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='sidebar'
          control={form.control}
          render={() => (
            <FormItem>
              <div className='mb-4'>
                <div className='truncate *:contents'>
                  <FormLabel>Username</FormLabel> <FormMessage />
                </div>

                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>

              {/* TODO use nested FormFields like this in profile and account */}
              {sidebar.map(({ value, label }) => (
                <FormField
                  key={value}
                  name='sidebar'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem key={value} className='flex flex-row items-start'>
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, value])
                              : field.onChange(
                                  field.value?.filter((v) => v !== value)
                                )
                          }}
                        />
                      </FormControl>

                      <FormLabel className='font-normal'>{label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </FormItem>
          )}
        />

        <Button type='submit'>Update display</Button>
      </form>
    </Form>
  )
}
