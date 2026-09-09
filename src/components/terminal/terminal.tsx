'use client'

import { Fragment } from 'react'

import { useTerminalContext } from '@/contexts/terminal'
import { useKeyHandler } from '@/hooks/use-key-handler'

import TitleBar from '../title-bar'
import LastLoginMessage from './last-login-message'
import Prompt from './prompt'
import PromptText from './prompt-text'

const Terminal = () => {
  const { pwd, showLastLoginMessage, content, isReadingInput } = useTerminalContext()

  useKeyHandler()

  return (
    <>
      <TitleBar />
      <div className='min-h-[calc(100vh-40px)] p-1 font-mono leading-6 wrap-break-word **:whitespace-pre-wrap'>
        {showLastLoginMessage && <LastLoginMessage />}
        {content.map((line) => (
          <Fragment key={line.id}>{line.element}</Fragment>
        ))}
        {isReadingInput ? null : (
          <Prompt pwd={pwd}>
            <PromptText />
          </Prompt>
        )}
      </div>
    </>
  )
}

export default Terminal
