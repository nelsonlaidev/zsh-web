import dayjs from 'dayjs'
import { useState } from 'react'

import { TTY_NAME } from '@/lib/constants'

const LastLoginMessage = () => {
  const [formattedDate] = useState(() => dayjs().format('ddd MMM DD HH:mm:ss'))

  return (
    <div>
      Last login: {formattedDate} on {TTY_NAME}
    </div>
  )
}

export default LastLoginMessage
