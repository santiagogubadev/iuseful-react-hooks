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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cbRef = useRef(onTimeout)

  useEffect(() => {
    cbRef.current = onTimeout
  }, [onTimeout])

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    setIsCleared(true)
  }, [])

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(cbRef.current, delayInMs)
    setIsCleared(false)
  }, [])

  const reset = useCallback(() => {
    clear()
    set()
  }, [clear, set])

  useEffect(() => {
    setIsCleared(false)
    set()

    return clear
  }, [delayInMs])

  return { isCleared, clear, reset }
}
