import { useEffect } from 'react'

import { useTerminalContext } from '@/contexts/terminal'
import { handleKey } from '@/lib/key-handlers'

export function useKeyHandler() {
  const context = useTerminalContext()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      void handleKey(context, e)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [context])
}
