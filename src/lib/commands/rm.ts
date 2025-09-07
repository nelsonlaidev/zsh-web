import type { Output, ReadInput } from '../handle-enter-key'
import type { TerminalContextValue } from '@/contexts/terminal'

import * as fs from '@zenfs/core/promises'
import arg from 'arg'

import { getFsError } from '@/utils/get-fs-error'

const ARG_SPEC = {
  '--force': Boolean,
  '--interactive': Boolean,
  '--dir': Boolean,
  '--preserve-root': Boolean,
  '--recursive': Boolean,
  '--verbose': Boolean,

  '-f': '--force',
  '-i': '--interactive',
  '-d': '--dir',
  '-I': Boolean,
  '-P': '--preserve-root',
  '-R': '--recursive',
  '-r': '--recursive',
  '-v': '--verbose',
  '-W': Boolean,
  '-x': Boolean
} as const

type ArgvType = arg.Result<typeof ARG_SPEC>

const handleInteractivePrompt = async (target: string, readInput: ReadInput): Promise<boolean> => {
  const examineInput = await readInput(`examine files in directory ${target}? `)
  const examineResponse = examineInput.trim().toLowerCase()

  if (examineResponse !== 'y' && examineResponse !== 'yes') {
    return false
  }

  const removeInput = await readInput(`remove ${target}? `)
  const removeResponse = removeInput.trim().toLowerCase()

  return removeResponse === 'y' || removeResponse === 'yes'
}

const createSuccessHandler = (target: string, verbose: boolean | undefined, output: Output) => {
  return () => {
    if (verbose) {
      output(target)
    }
  }
}

const removeFileOrDirectory = async (pwd: string, target: string, recursive: boolean | undefined): Promise<void> => {
  await (recursive ? fs.rm(`${pwd}/${target}`, { recursive: true }) : fs.unlink(`${pwd}/${target}`))
}

const handleRemovalError = (error: unknown, target: string, output: Output): void => {
  const fsError = getFsError(error)

  if (fsError?.code === 'ENOENT') {
    output(`rm: ${target}: No such file or directory`)
  } else if (fsError?.code === 'EISDIR') {
    output(`rm: ${target}: is a directory`)
  }
}

const processTarget = async (
  target: string,
  pwd: string,
  argv: ArgvType,
  output: Output,
  readInput: ReadInput
): Promise<void> => {
  try {
    const onSuccess = createSuccessHandler(target, argv['--verbose'], output)

    if (argv['--interactive']) {
      await fs.stat(`${pwd}/${target}`)

      const shouldProceed = await handleInteractivePrompt(target, readInput)
      if (!shouldProceed) return
    }

    await removeFileOrDirectory(pwd, target, argv['--recursive'])
    onSuccess()
  } catch (error) {
    handleRemovalError(error, target, output)
  }
}

export const rm = async (context: TerminalContextValue, args: string[], output: Output, readInput: ReadInput) => {
  const { pwd } = context

  const argv = arg(ARG_SPEC, {
    argv: args,
    stopAtPositional: true
  })

  const targets = argv._

  if (targets.length === 0) {
    output('usage: rm [-f | -i] [-dIPRrvWx] file ...\n       unlink [--] file')
    return
  }

  for (const target of targets) {
    await processTarget(target, pwd, argv, output, readInput)
  }
}
