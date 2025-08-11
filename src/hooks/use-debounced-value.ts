import { useEffect, useState } from 'react'

/**
 * A hook that returns a debounced version of the input value.
 * @param value - The value to debounce.
 * @param [delayInMs=300] - The debounce delay in milliseconds. Default is 300ms.
 * @returns The debounced value.
 */
export function useDebouncedValue<T>(value: T, delayInMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayInMs)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delayInMs])

  return debouncedValue
}
