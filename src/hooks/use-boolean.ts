import { useCallback, useState } from 'react'

interface UseBooleanReturn {
  /**
   * The current boolean value.
   */
  value: boolean
  /**
   * Function to toggle the boolean value.
   */
  toggle: () => void
  /**
   * Function to set the boolean value.
   * @param param - A boolean value or a function that receives the previous boolean value and returns a new boolean value.
   * If a function is provided, it will be called with the previous value to compute the new value.
   * @returns new boolean value.
   */
  set: (param: boolean | ((prev: boolean) => boolean)) => void
}

/**
 * A custom hook that manages a boolean state.
 * @param [isActive=true] - Initial value for the boolean state. Defaults to false.
 * @returns An object containing the current boolean value, a function to toggle the value, and a function to set the value.
 */
export function useBoolean (initialValue: boolean = false): UseBooleanReturn {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  const set = useCallback(
    (param: boolean | ((prev: boolean) => boolean)) => {
      setValue(param)
    }
    , [])

  return {
    set,
    toggle,
    value,
  }
}
