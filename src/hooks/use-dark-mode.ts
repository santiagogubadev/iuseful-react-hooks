import { useEffect } from 'react'
import { useMediaQuery } from './use-media-query'
import { useLocalStorage } from './use-storage'
import { isClient } from '@/utils/helpers/is-client'

/**
 * A custom hook that manages dark mode state.
 * @param darkModeKey The key used to store the dark mode preference in local storage and the class name applied to the body element.
 */
export function useDarkMode(darkModeKey: string = 'dark') {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(darkModeKey)
  const prefersDarkmode = useMediaQuery('(prefers-color-scheme: dark)')
  const enabled = darkMode ?? prefersDarkmode

  useEffect(() => {
    if (isClient) {
      document.body.classList.toggle(darkModeKey, enabled)
    }
  }, [enabled, darkModeKey])

  return [enabled, setDarkMode]
}
