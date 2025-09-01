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
 * A custom hook that debounces the execution of a callback function.
 *
 * This hook allows you to delay the execution of a callback until after a specified
 * delay has passed since the last time the dependencies changed. Useful for expensive
 * operations that shouldn't run on every render.
 *
 * @param callback - The callback function to debounce. Can return a Promise.
 * @param delayInMs - The delay in milliseconds to wait before calling the callback. Defaults to 150ms.
 * @param deps - The dependency array for the effect, similar to useEffect dependencies.
 * @param options - Configuration options for the debounced effect.
 * @param options.immediate - If true, the effect will run immediately on the first render. Defaults to true.
 *
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const [query, setQuery] = useState('')
 *   const [results, setResults] = useState([])
 *
 *   useDebouncedEffect(
 *     async () => {
 *       if (query) {
 *         const data = await searchAPI(query)
 *         setResults(data)
 *       }
 *     },
 *     300,
 *     [query],
 *     { immediate: false }
 *   )
 *
 *   return (
 *     <div>
 *       <input value={query} onChange={(e) => setQuery(e.target.value)} />
 *       <ul>{results.map(result => <li key={result.id}>{result.name}</li>)}</ul>
 *     </div>
 *   )
 * }
 * ```
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
