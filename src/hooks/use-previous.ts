import { useRef } from 'react'

/**
 * A custom hook that returns the previous value of a state or prop.
 * @param value The current value to track.
 * @returns The previous value, first render is null.
 */
export function usePrevious<TValue>(value: TValue) {
  const prevRef = useRef<TValue | null>(null)
  const currentRef = useRef<TValue | null>(value)

  if (currentRef.current !== value) {
    prevRef.current = currentRef.current
    currentRef.current = value
  }

  return prevRef.current
}
