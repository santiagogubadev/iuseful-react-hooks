import { copyToClipboard } from '@/utils/helpers/navigator'
import { useCallback, useState } from 'react'

type UseCopyToClipboardReturn = [
  (text: string) => void,
  {
    value: string | null
    success: boolean | null
    error: DOMException | null
    isCopying: boolean
  },
]

/**
 * A custom hook that provides a function to copy text to the clipboard.
 * @returns An array containing the copy function and the current copy state.
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [value, setValue] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [error, setError] = useState<DOMException | null>(null)
  const [isCopying, setIsCopying] = useState<boolean>(false)

  const copy = useCallback((text: string) => {
    setIsCopying(true)
    setError(null)
    setValue(null)
    setSuccess(null)

    copyToClipboard(text)
      .then(() => {
        setValue(text)
        setSuccess(true)
      })
      .catch((err) => {
        setError(err)
        setSuccess(false)
      })
      .finally(() => {
        setIsCopying(false)
      })
  }, [])

  return [copy, { value, success, error, isCopying }]
}
