import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
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
import { Input } from '@/components/form/input'
import { SelectInput } from '@/components/form/select'
import { ProfileForm } from './data/schema'
import { account, profiles } from './data/settings'

export function ProfileSettings() {
  const form = useForm<ProfileForm>({
    resolver: zodResolver(ProfileForm),
    defaultValues: profiles[0],
    mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  const onSubmit = (data: ProfileForm) => showSubmittedData(data)

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='username'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className='truncate *:contents'>
                <FormLabel>Username</FormLabel> <FormMessage />
              </div>

              <Input
                {...field}
                placeholder='Enter your username'
                minLength={2}
              />

              <FormDescription>
                You can only change this once every 30 days.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className='truncate *:contents'>
                <FormLabel>Email</FormLabel> <FormMessage />
              </div>

              <SelectInput
                {...field}
                items={account.emails}
                placeholder='Select the verified email to display'
              />

              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link to='/settings/account'>account settings</Link>.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          name='bio'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className='truncate *:contents'>
                <FormLabel>Bio</FormLabel> <FormMessage />
              </div>

              {/* TODO */}
              <Input
                {...field}
                // className='resize-none'
                placeholder='Tell us a little bit about yourself'
                minLength={2}
                maxLength={255}
              />

              <FormDescription>
                Type <span>@</span> to mention other users.
              </FormDescription>
            </FormItem>
          )}
        />

        <div>
          {fields.map((field, i) => (
            <FormField
              key={field.id}
              name={`urls.${i}.value`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className='truncate *:contents'>
                    <FormLabel>URL {++i}</FormLabel> <FormMessage />
                  </div>

                  <FormDescription className={cn(i !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>

                  {/* TODO */}
                  {/* <Input {...field} placeholder='Enter a URL' /> */}

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
            Add URL
          </Button>
        </div>

        <Button type='submit'>Update profile</Button>
      </form>
    </Form>
  )
}
