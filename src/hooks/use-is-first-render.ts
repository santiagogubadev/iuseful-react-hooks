import { useEffect, useRef } from 'react'

/**
 * A custom hook that returns true if the component is rendering for the first time, and false otherwise.
 * @returns True if it's the first render, false otherwise.
 */
export function useIsFirstRender () {
  const isFirstRender = useRef<boolean>(true)

  useEffect(() => {
    isFirstRender.current = false
  }, [])

  return isFirstRender.current
}
