import { useCallback, useEffect } from 'react'
import { useSingletonBroadcastChannel } from '@/hooks/use-singleton-broadcast-channel'

export interface UseBroadcastChannelListenerParams<T> {
  /**
   * The name of the BroadcastChannel to listen to.
   */
  channelName: string
  /**
   * The function to handle incoming messages.
   * @param ev - The message event to handle.
   */
  onMessage: (ev: MessageEvent<T>) => void
  /**
   * The function to handle errors when receiving messages.
   * @param ev - The error event to handle.
   */
  onError?: ((ev: Event) => void) | null
}

/**
 * A custom hook that listens for messages on a BroadcastChannel.
 */
export function useBroadcastChannelListener<T>({
  channelName,
  onMessage,
  onError = null,
}: UseBroadcastChannelListenerParams<T>) {
  const { channel } = useSingletonBroadcastChannel({ name: channelName })

  const memoizedOnMessage = useCallback(
    (ev: MessageEvent<T>) => {
      onMessage(ev)
    },
    [onMessage],
  )

  const memoizedOnError = useCallback(
    (ev: Event) => {
      onError?.(ev)
    },
    [onError],
  )

  useEffect(() => {
    if (!channel) return

    channel.addEventListener('message', memoizedOnMessage)
    if (memoizedOnError) {
      channel.addEventListener('messageerror', memoizedOnError)
    }

    return () => {
      channel.removeEventListener('message', memoizedOnMessage)
      if (memoizedOnError) {
        channel.removeEventListener('messageerror', memoizedOnError)
      }
    }
  }, [channel])
}
