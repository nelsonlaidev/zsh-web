import type { TerminalContextValue } from '@/contexts/terminal'
import type { Output, ReadInput } from '../key-handlers/types'

import * as fs from '@zenfs/core/promises'
import arg from 'arg'

import { getFsError } from '@/utils/get-fs-error'

const ARG_SPEC = {
  '--force': Boolean,
  '--interactive': Boolean,
  '--dir': Boolean,
  '--recursive': Boolean,
  '--verbose': Boolean,

  '-f': '--force',
  '-i': '--interactive',
  '-d': '--dir',
  '-R': '--recursive',
  '-r': '--recursive',
  '-v': '--verbose',
} as const

type ArgvType = arg.Result<typeof ARG_SPEC>

async function handleInteractivePrompt(target: string, readInput: ReadInput): Promise<boolean> {
  const examineInput = await readInput(`examine files in directory ${target}? `)
  const examineResponse = examineInput.trim().toLowerCase()

  if (examineResponse !== 'y' && examineResponse !== 'yes') {
    return false
  }

  const removeInput = await readInput(`remove ${target}? `)
  const removeResponse = removeInput.trim().toLowerCase()

  return removeResponse === 'y' || removeResponse === 'yes'
}

function createSuccessHandler(target: string, verbose: boolean | undefined, output: Output) {
  return () => {
    if (verbose) {
      output(target)
    }
  }
}

async function removeFileOrDirectory(
  pwd: string,
  target: string,
  recursive: boolean | undefined,
  dir: boolean | undefined,
): Promise<void> {
  const targetPath = `${pwd}/${target}`

  if (recursive) {
    await fs.rm(targetPath, { recursive: true })
  } else if (dir) {
    try {
      await fs.rmdir(targetPath)
    } catch (error) {
      if (getFsError(error)?.code === 'ENOTDIR') {
        await fs.unlink(targetPath)
      } else {
        throw error
      }
    }
  } else {
    await fs.unlink(targetPath)
  }
}

function handleRemovalError(error: unknown, target: string, output: Output, force: boolean | undefined): void {
  const fsError = getFsError(error)

  if (fsError?.code === 'ENOENT') {
    if (!force) {
      output(`rm: ${target}: No such file or directory`)
    }
  } else if (fsError?.code === 'EISDIR') {
    output(`rm: ${target}: is a directory`)
  } else if (fsError?.code === 'ENOTEMPTY') {
    output(`rm: ${target}: Directory not empty`)
  } else if (fsError?.code === 'ENOTDIR') {
    output(`rm: ${target}: Not a directory`)
  }
}

async function processTarget(
  target: string,
  pwd: string,
  argv: ArgvType,
  output: Output,
  readInput: ReadInput,
): Promise<void> {
  try {
    const onSuccess = createSuccessHandler(target, argv['--verbose'], output)

    if (argv['--interactive']) {
      await fs.stat(`${pwd}/${target}`)

      const shouldProceed = await handleInteractivePrompt(target, readInput)
      if (!shouldProceed) return
    }

    await removeFileOrDirectory(pwd, target, argv['--recursive'], argv['--dir'])
    onSuccess()
  } catch (error) {
    handleRemovalError(error, target, output, argv['--force'])
  }
}

export async function rm(context: TerminalContextValue, args: string[], output: Output, readInput: ReadInput) {
  const { pwd } = context

  let argv: ArgvType

  try {
    argv = arg(ARG_SPEC, {
      argv: args,
      stopAtPositional: true,
    })
  } catch (error) {
    output(`rm: ${error instanceof Error ? error.message : 'invalid arguments'}`)

    return
  }

  const targets = argv._

  if (targets.length === 0) {
    output('usage: rm [-f | -i] [-dRrv] file ...')
    return
  }

  for (const target of targets) {
    await processTarget(target, pwd, argv, output, readInput)
  }
}
