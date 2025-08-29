import { useEffect, useState } from 'react'

/**
 * A custom hook that returns the size of a DOM element.
 * @param fromRef A ref to the DOM element to measure.
 * @returns The size of the element.
 */
export function useSize<TElement extends Element>(fromRef: React.RefObject<TElement | null>) {
  const [size, setSize] = useState<DOMRectReadOnly>({} as DOMRectReadOnly)

  useEffect(() => {
    if (!fromRef.current) return

    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect))
    observer.observe(fromRef.current)

    return () => observer.disconnect()
  }, [fromRef])

  return size
}
