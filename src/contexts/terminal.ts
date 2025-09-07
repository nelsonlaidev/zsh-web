import { createContext, use } from 'react'

export type Content = Array<{
  id: string
  element: React.ReactElement
}>

export type TerminalContextValue = {
  pwd: string
  setPwd: React.Dispatch<React.SetStateAction<string>>
  showLastLoginMessage: boolean
  setShowLastLoginMessage: React.Dispatch<React.SetStateAction<boolean>>
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  caretPosition: number
  setCaretPosition: React.Dispatch<React.SetStateAction<number>>
  historyIndex: number
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>
  content: Content
  setContent: React.Dispatch<React.SetStateAction<Content>>
  appendContent: (element: React.ReactElement) => void
  isReadingInput: boolean
  setIsReadingInput: React.Dispatch<React.SetStateAction<boolean>>
}

const TerminalContext = createContext<TerminalContextValue | undefined>(undefined)
TerminalContext.displayName = 'TerminalContext'

export const useTerminalContext = (): TerminalContextValue => {
  const context = use(TerminalContext)

  if (!context) {
    throw new Error('useTerminalContext must be used within a TerminalProvider')
  }

  return context
}

export const TerminalProvider = TerminalContext.Provider
