import type { TerminalContextValue } from '@/contexts/terminal'
import type { Output } from '../key-handlers/types'

import * as path from '@zenfs/core/path'
import * as fs from '@zenfs/core/promises'
import arg from 'arg'

import { getFsError } from '@/utils/get-fs-error'

const ARG_SPEC = {
  '--no-create': Boolean,
  '--atime': Boolean,
  '--mtime': Boolean,

  '-c': '--no-create',
  '-a': '--atime',
  '-m': '--mtime',
} as const

type ArgvType = arg.Result<typeof ARG_SPEC>

async function updateTimes(filePath: string, argv: ArgvType) {
  const stats = await fs.stat(filePath)
  const now = new Date()

  const atime = argv['--mtime'] ? stats.atime : now
  const mtime = argv['--atime'] ? stats.mtime : now

  await fs.utimes(filePath, atime, mtime)
}

export async function touch(context: TerminalContextValue, args: string[], output: Output) {
  const { pwd } = context

  let argv: ArgvType

  try {
    argv = arg(ARG_SPEC, { argv: args, stopAtPositional: true })
  } catch (error) {
    output(`touch: ${error instanceof Error ? error.message : 'invalid arguments'}`)
    return
  }

  const files = argv._

  if (files.length === 0) {
    output('usage: touch [-acm] file ...')
    return
  }

  for (const file of files) {
    const filePath = path.resolve(pwd, file)

    try {
      await updateTimes(filePath, argv)
    } catch (error) {
      const fsError = getFsError(error)

      if (fsError?.code !== 'ENOENT') {
        output(`touch: ${file}: ${fsError?.message ?? 'unknown error'}`)

        continue
      }

      if (argv['--no-create']) continue

      try {
        await fs.writeFile(filePath, '')
      } catch (writeError) {
        const writeFsError = getFsError(writeError)

        if (writeFsError?.code === 'ENOENT') {
          output(`touch: ${file}: No such file or directory`)
        }
      }
    }
  }
}
