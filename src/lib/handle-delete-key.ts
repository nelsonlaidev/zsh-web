import type { TerminalContextValue } from '@/contexts/terminal'

import { splitStringAtIndex } from '@/utils/split-string-at-index'

export const handleDeleteKey = (context: TerminalContextValue) => {
  const { input, setInput, caretPosition } = context

  const [caretTextBefore, caretTextAfter] = splitStringAtIndex(input, caretPosition)

  setInput(`${caretTextBefore}${caretTextAfter ? caretTextAfter.slice(1) : ''}`)
}
