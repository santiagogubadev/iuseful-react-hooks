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
 * A hook that triggers a callback when a long press gesture is detected.
 *
 * This hook detects when a user presses and holds an element for a specified duration.
 * Useful for implementing context menus, alternative actions, or touch-friendly interfaces.
 * You can either provide your own ref or use the ref returned by the hook.
 *
 * @param params - Configuration object for the long press detection
 * @param params.onLongPress - Callback function called when a long press is detected
 * @param params.externalRef - Optional ref to an existing element. If not provided, the hook returns a ref to use
 * @param params.delay - The delay in milliseconds before triggering the long press. Defaults to 300ms
 * @returns When externalRef is provided, returns void. Otherwise returns an object with a ref to attach to your element
 *
 * @example
 * ```tsx
 * // Using the ref returned by the hook
 * function LongPressButton() {
 *   const { fromRef } = useLongPress({
 *     onLongPress: () => console.log('Long press detected!'),
 *     delay: 500
 *   })
 *
 *   return (
 *     <button ref={fromRef}>
 *       Hold me for 500ms
 *     </button>
 *   )
 * }
 *
 * // Using an external ref
 * function CustomElement() {
 *   const elementRef = useRef(null)
 *
 *   useLongPress({
 *     externalRef: elementRef,
 *     onLongPress: () => alert('Context menu triggered!'),
 *     delay: 800
 *   })
 *
 *   return <div ref={elementRef}>Long press me</div>
 * }
 * ```
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
