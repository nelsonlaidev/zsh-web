import type { Output } from '../handle-enter-key'
import type { TerminalContextValue } from '@/contexts/terminal'

export const pwd = (context: TerminalContextValue, output: Output) => {
  const { pwd: _pwd } = context

  output(_pwd)
}
