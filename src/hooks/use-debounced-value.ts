import { useEffect, useState } from 'react'

interface UseDebouncedValueOptionsParam {
  /**
   * The debounce delay in milliseconds.
   * @default 300
   */
  delayInMs?: number
}

/**
 * A hook that returns a debounced version of the input value.
 * @param value - The value to debounce.
 * @param options - The options for the debounce behavior.
 * @returns The debounced value.
 */
export function useDebouncedValue<T>(
  value: T,
  { delayInMs = 300 }: UseDebouncedValueOptionsParam = {},
): T {
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
