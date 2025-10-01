import { useEffect, useRef, useState } from 'react'
import { isClient } from '@/utils/helpers/is-client'

export interface UseNearScreenParams<T> {
  /**
   * A external ref to the element to observe.
   * If not provided, a new ref will be created.
   * @default null
   */
  externalRef?: React.RefObject<T>
  /**
   * If true, the observer will be disconnected after the first intersection.
   * @default true
   */
  once?: boolean
  /**
   * The root margin to use for the intersection observer.
   * @default '100px'
   */
  rootMargin?: string
}

interface UseNearScreenReturn<TElement> {
  /**
   * Whether the element is near the viewport.
   */
  isNearScreen: boolean
  /**
   * A ref to the observed element.
   * If {@link UseNearScreenParams.externalRef} is not provided, a new ref will be created.
   */
  fromRef: React.RefObject<TElement | null>
}

/**
 * Custom hook to detect if an element is near the viewport.
 * @returns An object containing the isNearScreen state and a ref to the observed element.
 */
export function useNearScreen<TElement extends HTMLElement | null>({
  externalRef,
  once = true,
  rootMargin = '100px',
}: UseNearScreenParams<TElement> = {}): UseNearScreenReturn<TElement> {
  const [isNearScreen, setIsNearScreen] = useState<boolean>(false)
  const fromRef = useRef<TElement | null>(null)

  useEffect(() => {
    if (!isClient || typeof IntersectionObserver === 'undefined') return

    const element = externalRef ? externalRef.current : fromRef.current

    const onChange = (
      [firstEntry]: IntersectionObserverEntry[],
      observer: IntersectionObserver,
    ) => {
      if (!firstEntry) return
      const { isIntersecting } = firstEntry
      if (!once || isIntersecting) setIsNearScreen(isIntersecting)
      if (isIntersecting && once) observer.disconnect()
    }

    const observer = new IntersectionObserver(onChange, {
      rootMargin,
    })

    if (element) {
      observer.observe(element)
    }

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [externalRef, once, rootMargin])

  return { isNearScreen, fromRef }
}
