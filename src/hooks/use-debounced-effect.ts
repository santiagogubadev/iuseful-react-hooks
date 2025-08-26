import { DependencyList, useEffect } from 'react'
import { useTimeout } from './use-timeout'
import { useIsFirstRender } from './use-is-first-render'

interface UseDebouncedEffectOptionsParam {
  /**
   * If true, the effect will run on the first render.
   */
  immediate?: boolean
}

/**
 * A custom hook that debounces a callback function.
 * @param callback - The callback function to debounce.
 * @param delay - The delay in milliseconds to wait before calling the callback.
 * @param deps - The dependency array for the effect.
 */
export function useDebouncedEffect(
  callback: () => void | Promise<void>,
  delayInMs: number = 150,
  deps: DependencyList = [],
  { immediate = true }: UseDebouncedEffectOptionsParam = {},
) {
  const isFirstRender = useIsFirstRender()
  const { reset, clear } = useTimeout(callback, delayInMs)

  useEffect(() => {
    if (isFirstRender && immediate) {
      callback()
    }

    reset()
  }, [...deps, reset])
  useEffect(clear, [])
}
