import { useCallback, useState } from 'react'
import { useEventListener } from './use-event-listener'
import { isClient } from '@/utils/helpers/is-client'

/**
 * A custom hook that returns the online status of the user.
 */
export function useIsOnline() {
  const [isOnline, setIsOnline] = useState<boolean>(isClient ? navigator.onLine : true)

  const handleOnlineStatus = useCallback(() => {
    if (isClient) {
      setIsOnline(navigator.onLine)
    }
  }, [])

  useEventListener('online', handleOnlineStatus)
  useEventListener('offline', handleOnlineStatus)

  return isOnline
}
