import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { TTY_NAME } from '@/lib/constants'

const LastLoginMessage = () => {
  const [formattedDate, setFormattedDate] = useState('--- --- -- --:--:--')

  useEffect(() => {
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- Required to prevent SSR hydration mismatch by computing date only on client side
    setFormattedDate(dayjs().format('ddd MMM DD HH:mm:ss'))
  }, [])

  return (
    <div>
      Last login: {formattedDate} on {TTY_NAME}
    </div>
  )
}

export default LastLoginMessage
