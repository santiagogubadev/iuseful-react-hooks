/**
 * Checks if a function returns a Promise.
 * @param fn - The function to check.
 * @returns True if the function returns a Promise, false otherwise.
 */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return (
    !!value &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as any).then === 'function'
  )
}

/**
 * A no-operation function.
 */
export function noop() {}
