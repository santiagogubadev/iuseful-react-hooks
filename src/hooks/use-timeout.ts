import { useCallback, useEffect, useRef, useState } from 'react'

interface UseTimeoutOptionsParam {
  /**
   * If true, the timeout will be cleared when the component unmounts.
   * @default true
   */
  clearOnUnmount?: boolean
}

type UseTimeoutReturn = [boolean, () => void]

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
  { clearOnUnmount = true }: UseTimeoutOptionsParam = {},
): UseTimeoutReturn {
  const [isCleared, setIsCleared] = useState<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const memoizedCb = useCallback(onTimeout, [onTimeout])

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    setIsCleared(true)
  }, [])

  useEffect(() => {
    setIsCleared(false)
    timeoutRef.current = setTimeout(memoizedCb, delayInMs)
  }, [delayInMs])

  useEffect(
    () => () => {
      if (!clearOnUnmount) return
      clear()
    },
    [clearOnUnmount],
  )

  return [isCleared, clear]
}
