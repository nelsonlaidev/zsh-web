import { useScreenSize } from '@/hooks/use-screen-size'
import { useWindowFocus } from '@/hooks/use-window-focus'
import { USERNAME } from '@/lib/constants'
import { cn } from '@/utils/cn'

import Controls from './controls'

const TitleBar = () => {
  const { width, height } = useScreenSize()
  const isFocused = useWindowFocus()

  return (
    <div className={cn('relative flex items-center px-3 py-2', isFocused ? 'bg-[#38383b]' : 'bg-[#2b2a2c]')}>
      <Controls />
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-1/2 font-bold',
          isFocused ? 'text-[#b6b5b6]' : 'text-[#6d6c6d]'
        )}
      >
        {USERNAME} — -zsh — {width}x{height}
      </div>
    </div>
  )
}

export default TitleBar
