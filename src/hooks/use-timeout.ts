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
 * A custom hook that sets a timeout and provides a way to clear it.
 * @param onTimeout - The callback function to be called when the timeout is reached.
 * @param delayInMs - The delay in milliseconds before the timeout is triggered.
 * @param [optionsParams={}] - Additional options for the timeout behavior.
 * @returns An array containing a boolean indicating if the timeout was cleared and a function to clear the timeout.
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
