import { useEffect, useRef } from 'react'

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (ev: WindowEventMap[K]) => any,
  target?: EventTarget,
  options?: boolean | AddEventListenerOptions,
): void
export function useEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  target?: EventTarget,
  options?: boolean | AddEventListenerOptions,
): void

/**
 * A custom hook that adds an event listener to a target element.
 * @param type The type of the event to listen for.
 * @param listener The event listener function.
 * @param target The target element to attach the listener to (defaults to window).
 * @param options Options for the event listener.
 */
export function useEventListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  target: EventTarget = window,
  options?: boolean | AddEventListenerOptions,
): void {
  const listenerRef = useRef(listener)

  useEffect(() => {
    listenerRef.current = listener
  }, [listener])

  useEffect(() => {
    const handler = (e: Event) => {
      const cb = listenerRef.current
      if (typeof cb === 'function') {
        cb(e)
      } else if (cb && typeof cb === 'object' && 'handleEvent' in cb) {
        cb.handleEvent(e)
      }
    }

    target.addEventListener(type, handler, options)
    return () => target.removeEventListener(type, handler, options)
  }, [type, target, options])
}
