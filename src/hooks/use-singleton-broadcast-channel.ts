import { useEffect, useMemo, useRef } from 'react'
import { acquireChannel, releaseChannel } from '@/utils/helpers/broadcast-channels'

export interface UseSingletonBroadcastChannelParams {
  /**
   * The name of the BroadcastChannel to acquire.
   */
  name: string
}

export interface UseSingletonBroadcastChannelReturn {
  /**
   * The BroadcastChannel instance.
   */
  channel: BroadcastChannel | null
}

export function useSingletonBroadcastChannel({
  name,
}: UseSingletonBroadcastChannelParams): UseSingletonBroadcastChannelReturn {
  const nameRef = useRef(name)

  useEffect(() => {
    nameRef.current = name
  }, [name])

  const channel = useMemo(() => acquireChannel(name), [name])

  useEffect(() => {
    return () => {
      releaseChannel(nameRef.current, channel)
    }
  }, [channel])

  return { channel }
}
