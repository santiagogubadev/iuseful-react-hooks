import { isPromise, noop } from '@/utils/helpers/functions'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseTimeoutReturn {
  /**
   * Indicates if the timeout was cleared.
   */
  isCleared: boolean
  /**
   * Clears the timeout.
   */
  clear: () => void
  /**
   * Resets the timeout.
   */
  reset: () => void
}

/**
 * A custom hook that sets a timeout and provides controls to manage it.
 *
 * This hook allows you to schedule a callback function to run after a specified delay,
 * with the ability to clear or reset the timeout at any time. The callback can be
 * synchronous or return a Promise.
 *
 * @param onTimeout - The callback function to be called when the timeout is reached. Can return a Promise.
 * @param delayInMs - The delay in milliseconds before the timeout is triggered.
 * @returns An object with timeout control functions and state.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isCleared, clear, reset } = useTimeout(() => {
 *     console.log('Timeout reached!')
 *   }, 3000)
 *
 *   return (
 *     <div>
 *       <p>Timeout cleared: {isCleared.toString()}</p>
 *       <button onClick={clear}>Clear Timeout</button>
 *       <button onClick={reset}>Reset Timeout</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTimeout(
  onTimeout: () => void | Promise<void>,
  delayInMs: number,
): UseTimeoutReturn {
  const [isCleared, setIsCleared] = useState<boolean>(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cbRef = useRef(onTimeout)

  useEffect(() => {
    cbRef.current = onTimeout
  }, [onTimeout])

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    setIsCleared(true)
  }, [])

  const schedule = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    timeoutRef.current = setTimeout(() => {
      const result = cbRef.current()
      if (isPromise(result)) result.catch(noop)
    }, delayInMs)

    setIsCleared(false)
  }, [delayInMs])

  const reset = useCallback(() => {
    clear()
    schedule()
  }, [clear, schedule])

  useEffect(() => {
    schedule()
    return clear
  }, [schedule, clear])

  return { isCleared, clear, reset }
}
