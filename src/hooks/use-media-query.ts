import { useEffect, useState } from 'react'
import { useEventListener } from './use-event-listener'

/**
 * A custom hook that listens for changes to a media query.
 * @param query The media query string to match against.
 * @returns A boolean indicating whether the media query matches the current viewport.
 */
export function useMediaQuery(query: string) {
  const [isMatch, setIsMatch] = useState<boolean>(false)
  const [mediaQueryList, setMediaQueryList] = useState<MediaQueryList | null>(null)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMediaQueryList(mql)
    setIsMatch(mql.matches)
  }, [query])

  useEventListener('change', (e) => setIsMatch(e.matches), mediaQueryList as MediaQueryList)

  return isMatch
}
