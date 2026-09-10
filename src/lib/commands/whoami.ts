import type { Output } from '../key-handlers/types'

import { USERNAME } from '@/constants/zsh'

export function whoami(output: Output) {
  output(USERNAME)
}
