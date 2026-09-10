import type { TerminalContextValue } from '@/contexts/terminal'
import type { Output } from '../key-handlers/types'

import * as fs from '@zenfs/core/promises'
import arg from 'arg'

import { getFsError } from '@/utils/get-fs-error'

async function createParentDirs(dir: string, pwd: string, mode: number, verbose: boolean, output: Output) {
  const parts = dir.split('/')
  let currentPath = pwd

  for (const part of parts) {
    currentPath += `/${part}`
    try {
      await fs.mkdir(currentPath, { mode })
      if (verbose) {
        output(currentPath.replace(`${pwd}/`, ''))
      }
    } catch (error) {
      const fsError = getFsError(error)
      if (fsError?.code === 'EEXIST') continue
      handleMkdirError(error, part, output)
    }
  }
}

async function createSingleDir(dir: string, pwd: string, mode: number, verbose: boolean, output: Output) {
  try {
    await fs.mkdir(`${pwd}/${dir}`, { mode })
    if (verbose) {
      output(dir)
    }
  } catch (error) {
    handleMkdirError(error, dir, output)
  }
}

function handleMkdirError(error: unknown, dir: string, output: Output) {
  const fsError = getFsError(error)

  if (fsError?.code === 'EEXIST') {
    output(`mkdir: ${dir}: File exists`)
  }
  if (fsError?.code === 'ENOENT') {
    output(`mkdir: ${dir}: No such file or directory`)
  }
}

const ARG_SPEC = {
  '--verbose': Boolean,
  '--parents': Boolean,
  '--mode': Number,

  '-v': '--verbose',
  '-p': '--parents',
  '-m': '--mode',
} as const

export async function mkdir(context: TerminalContextValue, args: string[], output: Output) {
  const { pwd } = context

  let argv: arg.Result<typeof ARG_SPEC>

  try {
    argv = arg(ARG_SPEC, {
      argv: args,
      stopAtPositional: true,
    })
  } catch (error) {
    output(`mkdir: ${error instanceof Error ? error.message : 'invalid arguments'}`)

    return
  }

  const dirs = argv._

  if (dirs.length === 0) {
    output('usage: mkdir [-pv] [-m mode] directory_name ...')
    return
  }

  const mode = argv['--mode'] ?? 0o777
  const verbose = argv['--verbose'] ?? false
  const parents = argv['--parents'] ?? false

  for (const dir of dirs) {
    await (parents
      ? createParentDirs(dir, pwd, mode, verbose, output)
      : createSingleDir(dir, pwd, mode, verbose, output))
  }
}
