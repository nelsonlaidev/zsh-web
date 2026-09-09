import type { TerminalContextValue } from '@/contexts/terminal'
import type { Output } from '../key-handlers/types'

export function pwd(context: TerminalContextValue, output: Output) {
  const { pwd: _pwd } = context

  output(_pwd)
}
