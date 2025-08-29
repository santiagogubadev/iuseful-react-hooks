import { useAsync } from './use-async'

/**
 * A custom hook for loading external scripts.
 * @param url - The URL of the script to load.
 */
export function useScript(url: string) {
  return useAsync(() => {
    const existing = document.querySelector(`script[src="${url}"]`)
    if (existing) return Promise.resolve()

    const script = document.createElement('script')
    script.src = url
    script.async = true
    document.body.appendChild(script)
    return new Promise((resolve, reject) => {
      script.onload = resolve
      script.onerror = reject
    })
  }, [url])
}
