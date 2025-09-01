import { useEffect, useRef } from 'react'
import { useTimeout } from './use-timeout'
import { useEventListener } from './use-event-listener'

interface UseLongPressParams<T> {
  /**
   * A ref to the element to measure.
   */
  externalRef?: React.RefObject<T>
  /**
   * A callback function that is called when the long press is triggered.
   */
  onLongPress: () => void
  /**
   * The delay before the onLongPress callback is triggered.
   */
  delay?: number
}

type UseLongPressReturn<T, HasExternalRef extends boolean> = HasExternalRef extends true
  ? void
  : {
      /**
       * A ref to the element to measure.
       */
      fromRef: React.RefObject<T>
    }

export function useLongPress<TElement extends HTMLElement = HTMLElement>(
  params: Omit<UseLongPressParams<TElement>, 'externalRef'>,
): UseLongPressReturn<TElement, false>

/**
 * A hook that triggers a callback when a long press is detected.
 * @param param0 - The parameters for the long press event.
 */
export function useLongPress<TElement extends HTMLElement = HTMLElement>({
  externalRef,
  onLongPress,
  delay = 300,
}: UseLongPressParams<TElement>) {
  const fromRef = useRef<TElement>(undefined)
  const { reset, clear } = useTimeout(onLongPress, delay)
  useEffect(clear, [])

  useEventListener(
    'mousedown',
    reset,
    (externalRef?.current ?? fromRef.current) as TElement as HTMLElement,
  )
  useEventListener(
    'touchstart',
    reset,
    (externalRef?.current ?? fromRef.current) as TElement as HTMLElement,
  )
  useEventListener(
    'mouseup',
    clear,
    (externalRef?.current ?? fromRef.current) as TElement as HTMLElement,
  )
  useEventListener(
    'touchend',
    clear,
    (externalRef?.current ?? fromRef.current) as TElement as HTMLElement,
  )
  useEventListener(
    'mouseleave',
    clear,
    (externalRef?.current ?? fromRef.current) as TElement as HTMLElement,
  )

  // casting for documentation
  if (externalRef == null) return { fromRef } as UseLongPressReturn<TElement, false>
}
