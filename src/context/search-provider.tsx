import { createContext, useContext, useEffect, useState } from 'react'
import { CommandMenu } from '@/components/command-menu'

export const SHORTCUT = 'k'

type SearchProviderProps = {
  children: React.ReactNode
}

type SearchContextState = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchContext = createContext<SearchContextState | null>(null)

export function SearchProvider({ children }: SearchProviderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === SHORTCUT && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    addEventListener('keydown', onKeyDown)
    return () => removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <SearchContext value={{ open, setOpen }}>
      {children}
      <CommandMenu />
    </SearchContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  const context = useContext(SearchContext)

  if (context) return context
  throw new Error('useSearch must be used within a SearchProvider')
}
