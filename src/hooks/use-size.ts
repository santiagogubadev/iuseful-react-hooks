import { useEffect, useRef, useState } from 'react'

type UseSizeReturn<TElement, HasExternalRef extends boolean> = HasExternalRef extends true
  ? {
      /**
       * The size of the element.
       */
      size: DOMRectReadOnly
    }
  : {
      /**
       * The size of the element.
       */
      size: DOMRectReadOnly
      /**
       * A ref to the DOM element to measure.
       */
      fromRef: React.RefObject<TElement | null>
    }

export function useSize<TElement extends Element = Element>(): UseSizeReturn<TElement, false>
export function useSize<TElement extends Element = Element>(
  externalRef: React.RefObject<TElement | null>,
): UseSizeReturn<TElement, true>

/**
 * A custom hook that returns the size of a DOM element.
 * @param externalRef A ref to the DOM element to measure.
 * @returns The size of the element and optionally fromRef if no externalRef is provided.
 */
export function useSize<TElement extends Element = Element>(
  externalRef?: React.RefObject<TElement | null>,
): UseSizeReturn<TElement, boolean> {
  const fromRef = useRef<TElement | null>(null)
  const [size, setSize] = useState<DOMRectReadOnly>({} as DOMRectReadOnly)

  useEffect(() => {
    const element = externalRef?.current ?? fromRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect))
    observer.observe(element)

    return () => observer.disconnect()
  }, [externalRef])

  // casting for documentation
  if (externalRef) return { size } as UseSizeReturn<TElement, true>

  return { size, fromRef } as UseSizeReturn<TElement, false>
}
