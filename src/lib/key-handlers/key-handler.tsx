import type { Content, TerminalContextValue } from '@/contexts/terminal'

import { Prompt } from '@/components/terminal/prompt'
import { PromptText } from '@/components/terminal/prompt-text'
import { splitStringAtIndex } from '@/utils/split-string-at-index'

import { cat } from '../commands/cat'
import { cd } from '../commands/cd'
import { clear } from '../commands/clear'
import { ls } from '../commands/ls'
import { mkdir } from '../commands/mkdir'
import { pwd } from '../commands/pwd'
import { rm } from '../commands/rm'
import { whoami } from '../commands/whoami'
import { getCommandHistory, writeCommandHistory } from '../fs'

function updateContentWithInput(text: string, value: string, prev: Content): Content {
  const lastIndex = prev.length - 1
  const lastElement = prev.at(-1)

  const updatedContent = [...prev]

  if (!lastElement) return updatedContent

  updatedContent[lastIndex] = {
    ...lastElement,
    element: (
      <div>
        {text}
        {value}
      </div>
    ),
  }

  return updatedContent
}

async function handleEnterKey(context: TerminalContextValue) {
  const {
    pwd: currentPath,
    input,
    setInput,
    setContent,
    appendContent,
    setCaretPosition,
    setHistoryIndex,
    setIsReadingInput,
  } = context

  function output(text: React.ReactNode) {
    appendContent(<div>{text}</div>)
  }

  function handlePromptTextCallback(text: string, value: string, resolve: (value: string) => void) {
    setIsReadingInput(false)
    setInput('')
    setContent((prev) => updateContentWithInput(text, value, prev))
    resolve(value)
  }

  async function readInput(text: string): Promise<string> {
    setIsReadingInput(true)

    return new Promise((resolve) => {
      appendContent(
        <div>
          {text}
          <PromptText
            callback={(value) => {
              handlePromptTextCallback(text, value, resolve)
            }}
          />
        </div>,
      )
    })
  }

  // Add the input to the terminal content
  appendContent(<Prompt pwd={currentPath}>{input}</Prompt>)

  if (input.trim() === '') return

  // Save the input to the command history
  writeCommandHistory(input)

  // Clear the input
  setInput('')
  setCaretPosition(0)
  setHistoryIndex(-1)

  const formattedInput = input.replaceAll(/\s+/g, ' ').trim()
  const [command, ...args] = formattedInput.split(' ')

  if (!command) return

  switch (command) {
    case 'clear': {
      clear(context)
      break
    }
    case 'pwd': {
      pwd(context, output)
      break
    }
    case 'whoami': {
      whoami(output)
      break
    }
    case 'mkdir': {
      await mkdir(context, args, output)
      break
    }
    case 'ls': {
      await ls(context, args, output)
      break
    }
    case 'rm': {
      await rm(context, args, output, readInput)
      break
    }
    case 'cd': {
      await cd(context, args, output)
      break
    }
    case 'cat': {
      await cat(context, args, output)
      break
    }
    default: {
      output(`zsh: command not found: ${command}`)
      break
    }
  }
}

function handleNormalKey(context: TerminalContextValue, key: string) {
  const { input, setInput, caretPosition, setCaretPosition } = context

  const [beforeCaret, afterCaret] = splitStringAtIndex(input, caretPosition)
  setInput(`${beforeCaret}${key}${afterCaret}`)
  setCaretPosition(caretPosition + 1)
}

function handleBackspaceKey(context: TerminalContextValue) {
  const { input, setInput, caretPosition, setCaretPosition } = context

  const [caretTextBefore, caretTextAfter] = splitStringAtIndex(input, caretPosition)

  setInput(`${caretTextBefore ? caretTextBefore.slice(0, -1) : ''}${caretTextAfter}`)

  if (input && input.length > 0) setCaretPosition(caretPosition - 1)
}

function handleDeleteKey(context: TerminalContextValue) {
  const { input, setInput, caretPosition } = context

  const [caretTextBefore, caretTextAfter] = splitStringAtIndex(input, caretPosition)

  setInput(`${caretTextBefore}${caretTextAfter ? caretTextAfter.slice(1) : ''}`)
}

function handleArrowUpKey(context: TerminalContextValue) {
  const { setCaretPosition, setInput, historyIndex, setHistoryIndex } = context

  const history = getCommandHistory()
  const previousCommand = history[historyIndex + 1]

  if (previousCommand) {
    setCaretPosition(previousCommand.length)
    setInput(previousCommand)

    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
    }
  }
}

function handleArrowDownKey(context: TerminalContextValue) {
  const { setCaretPosition, setInput, historyIndex, setHistoryIndex } = context

  const history = getCommandHistory()
  const nextCommand = history[historyIndex - 1]

  if (nextCommand) {
    setCaretPosition(nextCommand.length)
    setInput(nextCommand)

    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
    }
  }
}

function handleArrowLeftKey(context: TerminalContextValue) {
  const { caretPosition, setCaretPosition } = context

  if (caretPosition > 0) setCaretPosition(caretPosition - 1)
}

function handleArrowRightKey(context: TerminalContextValue) {
  const { input, caretPosition, setCaretPosition } = context

  if (caretPosition < input.length) setCaretPosition(caretPosition + 1)
}

export async function handleKey(context: TerminalContextValue, e: KeyboardEvent) {
  e.preventDefault()

  const key = e.key

  switch (key) {
    case 'Enter': {
      if (context.isReadingInput) return

      await handleEnterKey(context)
      break
    }
    case 'Backspace': {
      handleBackspaceKey(context)
      break
    }
    case 'Delete': {
      handleDeleteKey(context)
      break
    }
    case 'ArrowLeft': {
      handleArrowLeftKey(context)
      break
    }
    case 'ArrowRight': {
      handleArrowRightKey(context)
      break
    }
    case 'ArrowUp': {
      handleArrowUpKey(context)
      break
    }
    case 'ArrowDown': {
      handleArrowDownKey(context)
      break
    }
    default: {
      if (key.length === 1) {
        handleNormalKey(context, key)
      }
      break
    }
  }
}
