import { useCallback, useState } from 'react'
import { useEventListener } from './use-event-listener'

/**
 * A custom hook that returns the online status of the user.
 */
export function useIsOnline() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)

  const handleOnlineStatus = useCallback(() => setIsOnline(navigator.onLine), [])

  useEventListener('online', handleOnlineStatus)
  useEventListener('offline', handleOnlineStatus)

  return isOnline
}
