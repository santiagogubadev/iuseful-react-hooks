import { useCallback, useRef, useState } from 'react'

type InitialState<S> = S | (() => S)

type NewState<S> = S | ((prev: S) => S)

interface UseStateWithHistoryHandlersReturn<S> {
  /**
   * History of state values.
   */
  history: S[]
  /**
   * Pointer to the current history entry.
   */
  pointer: number
  /**
   * Go to a specific history entry.
   * @param pointer The index of the history entry to go to.
   */
  go: (pointer: number) => void
  /**
   * Go back to the previous history entry.
   */
  back: () => void
  /**
   * Go forward to the next history entry.
   */
  forward: () => void
}

export type UseStateWithHistoryReturn<S> = [
  /**
   * The current state value.
   */
  value: S,
  /**
   * A function to update the state value.
   */
  set: (newValue: NewState<S>) => void,
  /**
   * Handlers for navigating the history.
   */
  handlers: UseStateWithHistoryHandlersReturn<S>,
]

interface UseStateWithHistoryConfigParam {
  /**
   * The maximum number of history entries to keep.
   * @default 10
   */
  historyLimit?: number
}

export function useStateWithHistory<S = undefined>(
  initialState?: InitialState<S>,
  { historyLimit = 10 }: UseStateWithHistoryConfigParam = {},
): UseStateWithHistoryReturn<S> {
  const [value, setValue] = useState<S>(initialState as InitialState<S>)
  const historyRef = useRef<S[]>([value])
  const pointerRef = useRef<number>(0)

  const set = useCallback(
    (newValue: NewState<S>) => {
      const isUpdateFunction = typeof newValue === 'function' && newValue.length === 1
      const resolvedValue = isUpdateFunction
        ? (newValue as (prev: S) => S)(value as S)
        : (newValue as S)

      if (historyRef.current[pointerRef.current] === resolvedValue) return

      if (pointerRef.current < historyRef.current.length - 1) {
        historyRef.current.splice(pointerRef.current + 1)
      }
      historyRef.current.push(resolvedValue)

      // to remove oldest history entries
      while (historyRef.current.length > historyLimit) {
        historyRef.current.shift()
      }

      pointerRef.current = historyRef.current.length - 1
      setValue(resolvedValue)
    },
    [value, historyLimit],
  )

  const go = useCallback((pointer: number) => {
    if (pointer < 0 || pointer >= historyRef.current.length) return
    pointerRef.current = pointer
    setValue(historyRef.current[pointer])
  }, [])

  const back = useCallback(() => {
    if (pointerRef.current <= 0) return
    pointerRef.current--
    setValue(historyRef.current[pointerRef.current])
  }, [])

  const forward = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return
    pointerRef.current++
    setValue(historyRef.current[pointerRef.current])
  }, [])

  return [
    value,
    set,
    {
      history: historyRef.current,
      pointer: pointerRef.current,
      go,
      back,
      forward,
    },
  ]
}
