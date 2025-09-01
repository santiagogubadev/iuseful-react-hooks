import { NewState } from '@/utils/types/react'
import { useCallback, useState } from 'react'

type UseStateWithValidationReturn<T> = [
  /**
   * The current state value.
   */
  value: T,
  /**
   * A function to update the state value.
   */
  setValue: (nextValue: NewState<T>) => void,
  /**
   * A boolean indicating whether the current state value is valid.
   */
  isValid: boolean,
]

/**
 * A custom hook that manages state with validation.
 * @param validationFn A function that validates the state.
 * @param initialValue The initial state value.
 * @returns An array containing the state value, a setter function, and a validity flag.
 */
export function useStateWithValidation<T>(
  validationFn: (value: T) => boolean,
  initialValue: T,
): UseStateWithValidationReturn<T> {
  const [value, setValue] = useState<T>(initialValue)
  const [isValid, setIsValid] = useState<boolean>(true)

  const set = useCallback(
    (nextValue: NewState<T>) => {
      const resolvedValue =
        typeof nextValue === 'function' ? (nextValue as (prevState: T) => T)(value) : nextValue
      setValue(resolvedValue)
      setIsValid(validationFn(resolvedValue))
    },
    [validationFn, value],
  )

  return [value, set, isValid]
}
