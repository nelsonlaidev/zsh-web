import type { TerminalContextValue } from '@/contexts/terminal'

import { getCommandHistory } from './fs'

export const handleArrowDownKey = (context: TerminalContextValue) => {
  const { setCaretPosition, setInput, historyIndex, setHistoryIndex } = context

  const history = getCommandHistory()
  const nextCommand = history[historyIndex - 1]

  if (nextCommand) {
    setCaretPosition(nextCommand.length)
    setInput(nextCommand)

    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
    }
  }
}
