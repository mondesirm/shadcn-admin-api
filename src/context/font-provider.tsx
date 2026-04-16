import { createContext, useContext, useEffect, useState } from 'react'
import { fonts } from '@/config/fonts'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

export type Font = (typeof fonts)[number]['value']

export const DEFAULT = fonts[0].value
export const COOKIE_NAME = 'font'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type FontProviderProps = {
  storageKey?: string
  defaultFont?: Font
  children: React.ReactNode
}

type FontContextState = {
  font: Font
  defaultFont: Font
  setFont: (font: Font) => void
  resetFont: () => void
}

const FontContext = createContext<FontContextState | null>(null)

export function FontProvider({
  defaultFont = DEFAULT,
  storageKey = COOKIE_NAME,
  ...props
}: FontProviderProps) {
  const [font, _setFont] = useState<Font>(
    () => getCookie(storageKey) || defaultFont
  )

  useEffect(() => {
    const root = document.documentElement

    const apply = (font: Font) => {
      root.classList.forEach(
        (cls) => cls.startsWith('font-') && root.classList.remove(cls)
      )

      root.classList.add(`font-${font}`)
    }

    apply(font)
  }, [font])

  const setFont = (font: Font) => {
    _setFont(font)
    setCookie(COOKIE_NAME, font, COOKIE_MAX_AGE)
  }

  const resetFont = () => {
    _setFont(DEFAULT)
    removeCookie(COOKIE_NAME)
  }

  return (
    <FontContext value={{ font, defaultFont, setFont, resetFont }} {...props} />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFont = () => {
  const context = useContext(FontContext)

  if (context) return context
  throw new Error('useFont must be used within a FontProvider')
}
