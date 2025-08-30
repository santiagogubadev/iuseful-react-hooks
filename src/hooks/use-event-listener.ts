import { useEffect, useRef } from 'react'

// Helper type to get valid event keys for a target
type EventKeysForTarget<T> = T extends Window
  ? keyof WindowEventMap
  : T extends Document
    ? keyof DocumentEventMap
    : T extends HTMLElement
      ? keyof HTMLElementEventMap
      : T extends MediaQueryList
        ? keyof MediaQueryListEventMap
        : T extends CookieStore
          ? keyof CookieStoreEventMap
          : string

// Helper type to get the correct event type based on target and key
type EventForTargetAndKey<T, K> = T extends Window
  ? K extends keyof WindowEventMap
    ? WindowEventMap[K]
    : Event
  : T extends Document
    ? K extends keyof DocumentEventMap
      ? DocumentEventMap[K]
      : Event
    : T extends HTMLElement
      ? K extends keyof HTMLElementEventMap
        ? HTMLElementEventMap[K]
        : Event
      : T extends MediaQueryList
        ? K extends keyof MediaQueryListEventMap
          ? MediaQueryListEventMap[K]
          : Event
        : T extends CookieStore
          ? K extends keyof CookieStoreEventMap
            ? CookieStoreEventMap[K]
            : Event
          : Event

// Helper type for the listener based on target and event key
type ListenerForTargetAndKey<T, K> =
  | ((this: T, ev: EventForTargetAndKey<T, K>) => any)
  | { handleEvent(ev: EventForTargetAndKey<T, K>): any }

/**
 * A custom hook that adds an event listener to a target element.
 * @param type The type of the event to listen for.
 * @param listener The event listener function or object with handleEvent method.
 * @param target The target element to attach the listener to (defaults to window).
 * @param options Options for the event listener.
 */
export function useEventListener<
  T extends EventTarget = Window,
  K extends EventKeysForTarget<T> = EventKeysForTarget<T>,
>(
  type: K,
  listener: ListenerForTargetAndKey<T, K>,
  target: T = window as unknown as T,
  options?: boolean | AddEventListenerOptions,
): void {
  const listenerRef = useRef(listener)

  useEffect(() => {
    listenerRef.current = listener
  }, [listener])

  useEffect(() => {
    if (!target) return

    const handler: EventListener = (event: Event) => {
      const currentListener = listenerRef.current

      if (typeof currentListener === 'function') {
        currentListener.call(target, event as EventForTargetAndKey<T, K>)
      } else if (
        currentListener &&
        typeof currentListener === 'object' &&
        'handleEvent' in currentListener
      ) {
        currentListener.handleEvent(event as EventForTargetAndKey<T, K>)
      }
    }

    target.addEventListener(type as string, handler, options)
    return () => target.removeEventListener(type as string, handler, options)
  }, [type, target, options])
}
