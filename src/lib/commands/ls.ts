import type { TerminalContextValue } from '@/contexts/terminal'
import type { Output } from '../handle-enter-key'

import * as fs from '@zenfs/core/promises'

import { getFsError } from '@/utils/get-fs-error'

function sortFiles(files: string[]) {
  return files.toSorted((a, b) => a.localeCompare(b))
}

function formatFiles(files: string[]) {
  return files.join('\n')
}

export async function ls(context: TerminalContextValue, args: string[], output: Output) {
  const { pwd } = context

  if (args.length === 0) {
    const files = await fs.readdir(pwd)
    const sortedFiles = sortFiles(files)
    output(formatFiles(sortedFiles))

    return
  }

  if (args.length === 1) {
    try {
      await fs.stat(`${pwd}/${args[0]}`)
      const files = await fs.readdir(`${pwd}/${args[0]}`)
      const sortedFiles = sortFiles(files)
      output(formatFiles(sortedFiles))
    } catch (error) {
      const fsError = getFsError(error)

      if (fsError?.code === 'ENOENT') {
        output(`ls: ${args[0]}: No such file or directory`)
      }
    }

    return
  }

  for (const [index, arg] of args.entries()) {
    try {
      await fs.stat(`${pwd}/${arg}`)

      const files = await fs.readdir(`${pwd}/${arg}`)
      const sortedFiles = sortFiles(files)

      output(`${arg}:\n${formatFiles(sortedFiles)}\n`)
      if (index !== args.length - 1) {
        output('\n')
      }
    } catch (error) {
      const fsError = getFsError(error)

      if (fsError?.code === 'ENOENT') {
        output(`ls: ${arg}: No such file or directory`)
      }
    }
  }
}
