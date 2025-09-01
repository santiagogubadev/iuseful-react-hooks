import { useCallback } from 'react'
import { useSingletonBroadcastChannel } from '@/hooks/use-singleton-broadcast-channel'

export interface UseBroadcastChannelSenderParams {
  /**
   * The name of the BroadcastChannel to send messages through.
   */
  channelName: string
}

export interface UseBroadcastChannelSenderReturn<T> {
  /**
   * Function to send a message through the BroadcastChannel.
   * Only send clonable data types (e.g., objects, arrays, strings, numbers).
   * @param message - The message to send.
   */
  send: (message: T) => void
}

/**
 * A custom hook that provides a function to send messages through a BroadcastChannel.
 * @returns An object containing the send function and the BroadcastChannel instance.
 */
export function useBroadcastChannelSender<T>({
  channelName,
}: UseBroadcastChannelSenderParams): UseBroadcastChannelSenderReturn<T> {
  const { channel } = useSingletonBroadcastChannel({ name: channelName })

  const send = useCallback(
    (message: T) => {
      channel.postMessage(message)
    },
    [channel],
  )

  return { send }
}
