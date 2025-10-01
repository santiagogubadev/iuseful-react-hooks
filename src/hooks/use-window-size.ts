import { useState } from 'react'
import { useEventListener } from './use-event-listener'
import { isClient } from '@/utils/helpers/is-client'

export interface WindowSize {
  /**
   * The width of the window.
   */
  width: number
  /**
   * The height of the window.
   */
  height: number
}

const INITIAL_STATE = {
  width: isClient ? window.innerWidth : 0,
  height: isClient ? window.innerHeight : 0,
} satisfies WindowSize

/**
 * A custom hook that returns the current window size.
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>(INITIAL_STATE)

  useEventListener('resize', () => {
    if (isClient) {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  })

  return windowSize
}
