import { useMatches } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'

type ContentSectionProps = {
  children: React.JSX.Element
}

export function ContentSection({ children }: ContentSectionProps) {
  const lastCrumb = [...useMatches()].reverse().find((c) => c.context.getTitle)
  const { getTitle, getDescription } = lastCrumb?.context || {}

  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex-none'>
        <h3 className='text-lg font-medium empty:hidden'>{getTitle?.()}</h3>

        <p className='text-sm text-muted-foreground empty:hidden'>
          {getDescription?.()}
        </p>
      </div>

      <Separator className='my-4' />

      <div className='faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12'>
        <div className='-mx-1 px-1.5 lg:max-w-xl'>{children}</div>
      </div>
    </div>
  )
}
