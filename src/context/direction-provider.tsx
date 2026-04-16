import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DirectionProvider as RdxDirProvider } from '@radix-ui/react-direction'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

export type Direction = 'ltr' | 'rtl' | 'system'
export type ResolvedDirection = Exclude<Direction, 'system'>

export const DEFAULT = 'ltr'
export const COOKIE_NAME = 'dir'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type DirectionProviderProps = {
  defaultDir?: Direction
  storageKey?: string
  children: React.ReactNode
}

type DirectionContextState = {
  dir: Direction
  defaultDir: Direction
  resolvedDir: ResolvedDirection
  setDir: (dir: Direction) => void
  resetDir: () => void
}

const DirectionContext = createContext<DirectionContextState | null>(null)

export function DirectionProvider({
  defaultDir = DEFAULT,
  storageKey = COOKIE_NAME,
  children,
  ...props
}: DirectionProviderProps) {
  const [dir, _setDir] = useState<Direction>(
    () => getCookie(storageKey) || defaultDir
  )

  const resolvedDir = useMemo((): ResolvedDirection => {
    if (dir !== 'system') return dir
    return document.documentElement.getAttribute('dir') as ResolvedDirection
  }, [dir])

  useEffect(() => {
    document.documentElement.setAttribute('dir', resolvedDir)
  }, [dir, resolvedDir])

  const setDir = (dir: Direction) => {
    _setDir(dir)
    setCookie(storageKey, dir, COOKIE_MAX_AGE)
  }

  const resetDir = () => {
    _setDir(DEFAULT)
    removeCookie(storageKey)
  }

  return (
    <DirectionContext
      value={{ dir, defaultDir, resolvedDir, setDir, resetDir }}
      {...props}
    >
      <RdxDirProvider dir={resolvedDir}>{children}</RdxDirProvider>
    </DirectionContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDirection() {
  const context = useContext(DirectionContext)

  if (context) return context
  throw new Error('useDirection must be used within a DirectionProvider')
}
