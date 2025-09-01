import { useRef } from 'react'
import { useEventListener } from './use-event-listener'

interface UseClickOutSideParams<TElement> {
  /**
   * A ref to the DOM element to detect outside clicks.
   */
  externalRef?: React.RefObject<TElement>
  /**
   * A callback function that is called when a click outside the element is detected.
   * @param event The mouse event.
   */
  onClickOutside: (event: MouseEvent) => void
}

type UseClickOutSideReturn<TElement, HasExternalRef extends boolean> = HasExternalRef extends true
  ? void
  : {
      /**
       * A ref to the DOM element to measure.
       */
      fromRef: React.RefObject<TElement | null>
    }

export function useClickOutSide<TElement extends Element = Element>(
  params: Pick<UseClickOutSideParams<TElement>, 'onClickOutside'>,
): UseClickOutSideReturn<TElement, false>

/**
 * A hook that detects clicks outside of a specified element.
 * @param param0 The parameters for the hook.
 * @returns A ref to the element to measure.
 */
export function useClickOutSide<TElement extends Element = Element>({
  onClickOutside,
  externalRef,
}: UseClickOutSideParams<TElement>) {
  const fromRef = useRef<TElement>(null)

  useEventListener(
    'click',
    (e) => {
      const element = externalRef?.current ?? fromRef.current
      if (element == null || element.contains(e.target as Node)) return
      onClickOutside(e)
    },
    document,
  )

  // casting for documentation
  if (externalRef == null) return { fromRef } as UseClickOutSideReturn<TElement, false>
}
