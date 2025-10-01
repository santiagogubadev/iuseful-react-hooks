import { isClient } from './is-client'

/**
 * Copies the given text to the clipboard.
 * @param text The text to copy to the clipboard.
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (!isClient || !navigator.clipboard) {
    return Promise.reject(new Error('Clipboard API not available'))
  }
  await navigator.clipboard.writeText(text)
}
