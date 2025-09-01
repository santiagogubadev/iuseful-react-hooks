/**
 * Copies the given text to the clipboard.
 * @param text The text to copy to the clipboard.
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text)
}
