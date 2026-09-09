import type { TerminalContextValue } from '@/contexts/terminal'

export function clear(context: TerminalContextValue) {
  const { setContent, setShowLastLoginMessage } = context

  setContent([])
  setShowLastLoginMessage(false)
}
