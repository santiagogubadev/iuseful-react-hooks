import { DependencyList, useCallback, useEffect, useState } from 'react'

export interface UseAsyncReturn<TValue, CError> {
  /**
   * The result of the async operation.
   */
  value: TValue | null
  /**
   * The error, if any, that occurred during the async operation.
   */
  error: CError | null
  /**
   * Whether the async operation is currently loading.
   */
  loading: boolean
  /**
   * A function to refresh the async operation.
   */
  refresh: () => void
  /**
   * A function to manually set the value.
   */
  setValue: (value: TValue | null) => void
}

/**
 * A custom hook for handling asynchronous operations.
 * @param cb - The async function to call.
 * @param dependencies - The dependencies for the useEffect hook.
 * @returns An object containing the result, error, and loading state.
 */
export function useAsync<TValue, CError = Error>(
  cb: () => Promise<TValue>,
  dependencies: DependencyList = [],
): UseAsyncReturn<TValue, CError> {
  const [value, setValue] = useState<TValue | null>(null)
  const [error, setError] = useState<CError | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    setValue(null)
    setError(null)
    cb()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false))
  }, dependencies)

  useEffect(refresh, [refresh])

  return { value, error, loading, refresh, setValue }
}
