import { Exception } from 'kerium'

export function getFsError(error: unknown): Exception | undefined {
  if (error instanceof Exception) {
    return error
  }

  return undefined
}
