import { DependencyList, EffectCallback, useEffect } from 'react'
import { useIsFirstRender } from './use-is-first-render'

/**
 * Same as `useEffect`, but the effect will only run after the component has mounted.
 * This hook is useful for performing side effects that should only happen after the initial render.
 * @param effect - The effect callback to run after the component has mounted
 * @param deps - The dependency array for the effect
 */
export function useEffectAfterMount(effect: EffectCallback, deps?: DependencyList) {
  const isFirstRender = useIsFirstRender()

  useEffect(() => {
    if (!isFirstRender) return effect()
  }, deps)
}
