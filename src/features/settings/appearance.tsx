import { useForm } from 'react-hook-form'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { fonts } from '@/config/fonts'
import { useFont } from '@/context/font-provider'
import { useTheme } from '@/context/theme-provider'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AppearanceForm } from './data/schema'

export function SettingsAppearance() {
  const { font, setFont } = useFont()
  const { mode, setMode } = useTheme()

  const form = useForm<AppearanceForm>({
    resolver: zodResolver(AppearanceForm),
    defaultValues: { font, mode },
  })

  const onSubmit = (data: AppearanceForm) => {
    if (data.font !== font) setFont(data.font)
    if (data.mode !== mode) setMode(data.mode)

    showSubmittedData(data)
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='font'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>

              <div className='relative w-max'>
                <FormControl>
                  <select
                    {...field}
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-50 appearance-none font-normal capitalize',
                      'dark:bg-background dark:hover:bg-background'
                    )}
                  >
                    {fonts.map(({ value, label }) => (
                      <option key={value} value={value} children={label} />
                    ))}
                  </select>
                </FormControl>

                <ChevronDownIcon className='absolute end-3 top-2.5 h-4 w-4 opacity-50' />
              </div>

              <FormDescription className='font-manrope'>
                Set the font you want to use in the app.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name='mode'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode</FormLabel>

              <FormDescription>
                Select the mode for the dashboard.
              </FormDescription>

              <FormMessage />

              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className='grid max-w-md grid-cols-2 gap-8 pt-2'
              >
                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='light' className='sr-only' />
                    </FormControl>

                    <div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
                      <div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                        <div className='space-y-2 rounded-md bg-white p-2 shadow-xs'>
                          <div className='h-2 w-20 rounded-lg bg-[#ecedef]' />
                          <div className='h-2 w-25 rounded-lg bg-[#ecedef]' />
                        </div>

                        <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                          <div className='h-2 w-25 rounded-lg bg-[#ecedef]' />
                        </div>

                        <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                          <div className='h-2 w-25 rounded-lg bg-[#ecedef]' />
                        </div>
                      </div>
                    </div>

                    <span className='block w-full p-2 text-center font-normal'>
                      Light
                    </span>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='dark' className='sr-only' />
                    </FormControl>

                    <div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground'>
                      <div className='space-y-2 rounded-sm bg-slate-950 p-2'>
                        <div className='space-y-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                          <div className='h-2 w-20 rounded-lg bg-slate-400' />
                          <div className='h-2 w-25 rounded-lg bg-slate-400' />
                        </div>

                        <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-slate-400' />
                          <div className='h-2 w-25 rounded-lg bg-slate-400' />
                        </div>

                        <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-slate-400' />
                          <div className='h-2 w-25 rounded-lg bg-slate-400' />
                        </div>
                      </div>
                    </div>

                    <span className='block w-full p-2 text-center font-normal'>
                      Dark
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type='submit'>Update preferences</Button>
      </form>
    </Form>
  )
}
