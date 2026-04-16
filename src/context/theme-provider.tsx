import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { themes, modes } from '@/config/themes'
import { flushSync } from 'react-dom'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

export type Mode = (typeof modes)[number]['value']
export type Theme = (typeof themes)[number]['value']
export type ResolvedMode = Exclude<Mode, 'system'>
export type ResolvedTheme = Exclude<Theme, 'accent'>

export const DEFAULT_MODE = modes[0].value
export const DEFAULT_THEME = themes[0].value
export const MODE_COOKIE_NAME = 'mode'
export const THEME_COOKIE_NAME = 'theme'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365
export const SHORTCUT = 'd'

type ThemeProviderProps = {
  defaultMode?: Mode
  defaultTheme?: Theme
  modeStorageKey?: string
  themeStorageKey?: string
  options?: KeyframeAnimationOptions
  children: React.ReactNode
}

type ThemeContextState = {
  ref: React.RefObject<HTMLButtonElement | null>
  mode: Mode
  theme: Theme
  defaultMode: Mode
  resolvedMode: ResolvedMode
  defaultTheme: Theme
  setTheme: (theme: Theme) => void
  setMode: (mode: Mode) => void
  resetMode: () => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextState | null>(null)

export function ThemeProvider({
  defaultMode = DEFAULT_MODE,
  defaultTheme = DEFAULT_THEME,
  modeStorageKey = MODE_COOKIE_NAME,
  themeStorageKey = THEME_COOKIE_NAME,
  options,
  ...props
}: ThemeProviderProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const [mode, _setMode] = useState<Mode>(
    () => getCookie(modeStorageKey) || defaultMode
  )

  const [theme, _setTheme] = useState<Theme>(
    () => getCookie(themeStorageKey) || defaultTheme
  )

  const resolvedMode = useMemo((): ResolvedMode => {
    if (mode !== 'system') return mode
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [mode])

  useEffect(() => {
    const root = document.documentElement
    const meta = document.querySelector('meta[name=theme-color]')
    const mediaQuery = matchMedia('(prefers-color-scheme: dark)')

    const apply = (mode: ResolvedMode) => {
      modes.forEach((s) => root.classList.remove(s.value))
      root.classList.add(mode)

      const color = getComputedStyle(root).getPropertyValue('--background')
      if (meta) meta.setAttribute('content', color)
    }

    const onChange = () => mode === 'system' && apply(resolvedMode)

    apply(resolvedMode)
    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }, [mode, resolvedMode])

  useEffect(() => {
    const root = document.documentElement

    themes.forEach((s) => root.classList.remove(s.value))
    root.classList.add(theme)
  }, [theme])

  const animate = useCallback(
    (fn: () => void) => {
      if (!ref.current) return fn()

      const { top, left, width, height } = ref.current.getBoundingClientRect()
      const [x, y] = [left + width / 2, top + height / 2]
      const vw = visualViewport?.width ?? innerWidth
      const vh = visualViewport?.height ?? innerHeight
      const radius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y))

      if (!document.startViewTransition) return fn()

      const root = document.documentElement
      root.setAttribute('data-transition', 'true')

      const transition = document.startViewTransition(() => flushSync(fn))

      transition.ready.then(() =>
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 400,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
            ...options,
          }
        )
      )

      transition.finished.finally(() => root.removeAttribute('data-transition'))
    },
    [options]
  )

  const setMode = useCallback(
    (mode: Mode) => {
      const apply = () => {
        _setMode(mode)
        setCookie(modeStorageKey, mode, COOKIE_MAX_AGE)
      }

      if (mode === resolvedMode) return apply()
      animate(apply)
    },
    [animate, modeStorageKey, resolvedMode]
  )

  const setTheme = useCallback(
    (theme: Theme) => {
      const apply = () => {
        _setTheme(theme)
        setCookie(themeStorageKey, theme, COOKIE_MAX_AGE)
      }

      animate(apply)
    },
    [animate, themeStorageKey]
  )

  const resetMode = () => {
    _setMode(DEFAULT_MODE)
    removeCookie(modeStorageKey)
  }

  const resetTheme = () => {
    _setTheme(DEFAULT_THEME)
    removeCookie(themeStorageKey)
  }

  useEffect(() => {
    const root = document.documentElement

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === SHORTCUT && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setMode(root.classList.contains('dark') ? 'light' : 'dark')
      }
    }

    addEventListener('keydown', onKeyDown)
    return () => removeEventListener('keydown', onKeyDown)
  }, [setMode])

  return (
    <ThemeContext
      value={{
        ref,
        mode,
        theme,
        defaultMode,
        resolvedMode,
        defaultTheme,
        setMode,
        setTheme,
        resetMode,
        resetTheme,
      }}
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context) return context
  throw new Error('useTheme must be used within a ThemeProvider')
}
