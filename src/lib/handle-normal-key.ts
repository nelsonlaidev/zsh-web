import { type TerminalContextValue } from '@/contexts/terminal'
import { splitStringAtIndex } from '@/utils/split-string-at-index'

export const handleNormalKey = (context: TerminalContextValue, key: string) => {
  const { input, setInput, caretPosition, setCaretPosition } = context

  const [beforeCaret, afterCaret] = splitStringAtIndex(input, caretPosition)
  setInput(`${beforeCaret}${key}${afterCaret}`)
  setCaretPosition(caretPosition + 1)
}
