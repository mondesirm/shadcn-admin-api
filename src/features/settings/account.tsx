import { subYears } from 'date-fns'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { languages } from '@/config/languages'
// import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DateInput } from '@/components/form/date'
import { Input } from '@/components/form/input'
import { SelectInput } from '@/components/form/select'
import { AccountForm } from './data/schema'
import { account } from './data/settings'

export function AccountSettings() {
  const form = useForm<AccountForm>({
    resolver: zodResolver(AccountForm),
    defaultValues: account,
  })

  const { fields, append } = useFieldArray({
    name: 'emails',
    control: form.control,
  })

  const onSubmit = (data: AccountForm) => showSubmittedData(data)

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className='truncate *:contents'>
                <FormLabel>Name</FormLabel> <FormMessage />
              </div>

              <Input {...field} placeholder='Enter your name' minLength={2} />

              <FormDescription>
                This will be displayed on your profile and in emails.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          name='dob'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className='truncate *:contents'>
                <FormLabel>Date of birth</FormLabel> <FormMessage />
              </div>

              <DateInput
                {...field}
                mode='single'
                disabled={{ after: subYears(new Date(), 18) }}
              />

              <FormDescription>
                This will be used to calculate your age.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          name='language'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className='truncate *:contents'>
                <FormLabel>Language</FormLabel> <FormMessage />
              </div>

              <SelectInput
                {...field}
                items={languages}
                // iconFn={({ value }) => (
                //   <Badge className='w-6' variant='outline'>
                //     {value}
                //   </Badge>
                // )}
              />

              <FormDescription>
                This will be used to localize the app and emails.
              </FormDescription>
            </FormItem>
          )}
        />

        <div>
          {fields.map((field, i) => (
            <FormField
              key={field.id}
              name={`emails.${i}.value`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className='truncate *:contents'>
                    <FormLabel>Email Address {++i}</FormLabel> <FormMessage />
                  </div>

                  <FormDescription className={cn(i !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>

                  {/* TODO */}
                  {/* <Input {...field} placeholder='Enter an email address' /> */}

                  <FormControl className={cn(i !== 0 && 'mt-1.5')}>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}

          <Button
            className='mt-2'
            size='sm'
            variant='outline'
            onClick={() => append({ value: '' })}
          >
            Add email address
          </Button>
        </div>

        <Button type='submit'>Update account</Button>
      </form>
    </Form>
  )
}
