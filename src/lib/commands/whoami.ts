import type { Output } from '../key-handlers/types'

export function whoami(output: Output) {
  output('user')
}
