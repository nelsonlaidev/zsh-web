import type { TerminalContextValue } from '@/contexts/terminal'

export function handleArrowRightKey(context: TerminalContextValue) {
  const { input, caretPosition, setCaretPosition } = context

  if (caretPosition < input.length) setCaretPosition(caretPosition + 1)
}
