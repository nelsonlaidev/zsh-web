import type { Output } from '../handle-enter-key'
import type { TerminalContextValue } from '@/contexts/terminal'

import * as fs from '@zenfs/core/promises'
import arg from 'arg'

import { getFsError } from '@/utils/get-fs-error'

const createParentDirs = async (dir: string, pwd: string, mode: number, verbose: boolean, output: Output) => {
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
      console.log({ error, verbose, parents: true })
    }
  }
}

const createSingleDir = async (dir: string, pwd: string, mode: number, verbose: boolean, output: Output) => {
  try {
    await fs.mkdir(`${pwd}/${dir}`, { mode })
    if (verbose) {
      output(dir)
    }
  } catch (error) {
    console.log({ error, verbose, parents: false })
    handleMkdirError(error, dir, output)
  }
}

const handleMkdirError = (error: unknown, dir: string, output: Output) => {
  const fsError = getFsError(error)

  if (fsError?.code === 'EEXIST') {
    output(`mkdir: ${dir}: File exists`)
  }
  if (fsError?.code === 'ENOENT') {
    output(`mkdir: ${dir}: No such file or directory`)
  }
}

export const mkdir = async (context: TerminalContextValue, args: string[], output: Output) => {
  const { pwd } = context

  const argv = arg(
    {
      '--verbose': Boolean,
      '--parents': Boolean,
      '--mode': Number,

      '-v': '--verbose',
      '-p': '--parents',
      '-m': '--mode'
    },
    {
      argv: args,
      stopAtPositional: true
    }
  )

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
