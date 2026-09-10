import type { TerminalContextValue } from '@/contexts/terminal'
import type { Output } from '../key-handlers/types'

import * as path from '@zenfs/core/path'
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

  const targets = args.length === 0 ? [pwd] : args

  for (const arg of targets) {
    const targetPath = path.resolve(pwd, arg)

    try {
      const stats = await fs.stat(targetPath)

      if (stats.isDirectory()) {
        const files = await fs.readdir(targetPath)
        const formattedFiles = formatFiles(sortFiles(files))

        if (targets.length > 1) {
          output(`${arg}:\n${formattedFiles}`)
        } else {
          output(formattedFiles)
        }
      } else {
        output(arg)
      }
    } catch (error) {
      const fsError = getFsError(error)

      if (fsError?.code === 'ENOENT') {
        output(`ls: ${arg}: No such file or directory`)
      }
    }
  }
}
