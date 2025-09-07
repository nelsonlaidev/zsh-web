import type { TerminalContextValue } from '@/contexts/terminal'

import { splitStringAtIndex } from '@/utils/split-string-at-index'

export const handleBackspaceKey = (context: TerminalContextValue) => {
  const { input, setInput, caretPosition, setCaretPosition } = context

  const [caretTextBefore, caretTextAfter] = splitStringAtIndex(input, caretPosition)

  setInput(`${caretTextBefore ? caretTextBefore.slice(0, -1) : ''}${caretTextAfter}`)

  if (input && input.length > 0) setCaretPosition(caretPosition - 1)
}
