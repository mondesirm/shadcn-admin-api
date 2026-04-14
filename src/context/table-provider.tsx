import { createContext, useContext, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

type TableProviderProps = {
  children: React.ReactNode
}

interface TableContextType<TData = unknown, TDialogType = string> {
  open: TDialogType | null
  setOpen: (str: TDialogType | null) => void
  currentRow: TData | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TData | null>>
}

const TableContext = createContext<TableContextType | null>(null)

export function TableProvider({ children }: TableProviderProps) {
  const [open, setOpen] = useDialogState<string>(null)
  const [currentRow, setCurrentRow] = useState<unknown>(null)

  return (
    <TableContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TableContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTable = <TData, TDialogType>() => {
  const context = useContext(TableContext) as TableContextType<
    TData,
    TDialogType
  > | null

  if (context) return context
  throw new Error('useTable has to be used within <TableContext>')
}
