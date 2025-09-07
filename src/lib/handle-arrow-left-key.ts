import type { TerminalContextValue } from '@/contexts/terminal'

export const handleArrowLeftKey = (context: TerminalContextValue) => {
  const { caretPosition, setCaretPosition } = context

  if (caretPosition > 0) setCaretPosition(caretPosition - 1)
}
