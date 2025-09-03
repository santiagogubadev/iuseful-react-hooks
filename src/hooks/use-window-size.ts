import { useState } from 'react'
import { useEventListener } from './use-event-listener'

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
  width: window.innerWidth,
  height: window.innerHeight,
} satisfies WindowSize

/**
 * A custom hook that returns the current window size.
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>(INITIAL_STATE)

  useEventListener('resize', () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  })

  return windowSize
}
