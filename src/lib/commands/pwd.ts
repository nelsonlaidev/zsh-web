import type { TerminalContextValue } from '@/contexts/terminal'
import type { Output } from '../handle-enter-key'

export const pwd = (context: TerminalContextValue, output: Output) => {
  const { pwd: _pwd } = context

  output(_pwd)
}
