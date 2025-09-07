import { Exception } from 'kerium'

export const getFsError = (error: unknown): Exception | undefined => {
  if (error instanceof Exception) {
    return error
  }

  return undefined
}
