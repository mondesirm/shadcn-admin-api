import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar'

export function NavigationProgress() {
  const { status } = useRouterState()
  const ref = useRef<LoadingBarRef>(null)

  useEffect(() => {
    ref.current?.[status === 'pending' ? 'continuousStart' : 'complete']()
  }, [status])

  return (
    <LoadingBar ref={ref} height={2} color='var(--muted-foreground)' shadow />
  )
}
