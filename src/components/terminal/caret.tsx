import { cn } from 'cn'

import { useWindowFocus } from '@/hooks/use-window-focus'

const Caret = () => {
  const isWindowFocused = useWindowFocus()

  return (
    <span
      className={cn(
        'absolute -z-10 h-5.5 w-2.5 border border-[#9d9d9d]',
        isWindowFocused ? 'bg-[#9d9d9d]' : 'bg-transparent',
      )}
    />
  )
}

export default Caret
