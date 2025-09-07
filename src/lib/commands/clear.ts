import type { TerminalContextValue } from '@/contexts/terminal'

export const clear = (context: TerminalContextValue) => {
  const { setContent, setShowLastLoginMessage } = context

  setContent([])
  setShowLastLoginMessage(false)
}
