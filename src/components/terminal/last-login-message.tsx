import dayjs from 'dayjs'
import { useState } from 'react'

import { TTY_NAME } from '@/constants/zsh'

export function LastLoginMessage() {
  const [formattedDate] = useState(() => dayjs().format('ddd MMM DD HH:mm:ss'))

  return (
    <div>
      Last login: {formattedDate} on {TTY_NAME}
    </div>
  )
}
