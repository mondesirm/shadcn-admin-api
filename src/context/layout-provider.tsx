import { createContext, useContext, useState } from 'react'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

export type Variant = 'sidebar' | 'floating' | 'inset'
export type Collapsible = 'offcanvas' | 'icon' | 'none'

export const DEFAULT_VARIANT = 'inset'
export const DEFAULT_COLLAPSIBLE = 'icon'
export const VARIANT_COOKIE_NAME = 'layout_variant'
export const COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

type LayoutProviderProps = {
  variantStorageKey?: string
  collapsibleStorageKey?: string
  defaultVariant?: Variant
  defaultCollapsible?: Collapsible
  children: React.ReactNode
}

type LayoutContextState = {
  variant: Variant
  collapsible: Collapsible
  defaultVariant: Variant
  defaultCollapsible: Collapsible
  setVariant: (variant: Variant) => void
  setCollapsible: (collapsible: Collapsible) => void
  resetLayout: () => void
}

const LayoutContext = createContext<LayoutContextState | null>(null)

export function LayoutProvider({
  variantStorageKey = VARIANT_COOKIE_NAME,
  collapsibleStorageKey = COLLAPSIBLE_COOKIE_NAME,
  defaultVariant = DEFAULT_VARIANT,
  defaultCollapsible = DEFAULT_COLLAPSIBLE,
  ...props
}: LayoutProviderProps) {
  const [variant, _setVariant] = useState<Variant>(
    () => getCookie(variantStorageKey) || defaultVariant
  )

  const [collapsible, _setCollapsible] = useState<Collapsible>(
    () => getCookie(collapsibleStorageKey) || defaultCollapsible
  )

  const setVariant = (variant: Variant) => {
    _setVariant(variant)
    setCookie(VARIANT_COOKIE_NAME, variant, COOKIE_MAX_AGE)
  }

  const setCollapsible = (collapsible: Collapsible) => {
    _setCollapsible(collapsible)
    setCookie(COLLAPSIBLE_COOKIE_NAME, collapsible, COOKIE_MAX_AGE)
  }

  const resetLayout = () => {
    _setVariant(DEFAULT_VARIANT)
    _setCollapsible(DEFAULT_COLLAPSIBLE)
    removeCookie(VARIANT_COOKIE_NAME)
    removeCookie(COLLAPSIBLE_COOKIE_NAME)
  }

  return (
    <LayoutContext
      value={{
        variant,
        collapsible,
        defaultVariant,
        defaultCollapsible,
        setVariant,
        setCollapsible,
        resetLayout,
      }}
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLayout() {
  const context = useContext(LayoutContext)

  if (context) return context
  throw new Error('useLayout must be used within a LayoutProvider')
}
