import { useCallback, useRef } from 'react'
import { useBoolean } from './use-boolean'
import { useEventListener } from './use-event-listener'

interface UseHoverBaseParams<TElement> {
  /**
   * A ref to the DOM element to detect if it is hovered.
   */
  externalRef?: React.RefObject<TElement | null> | null
  /**
   * A callback function that is called when the element is hovered.
   * @param event The mouse event.
   */
  onHover?: (event: MouseEvent) => void
  /**
   * A callback function that is called when the element is unhovered.
   */
  onUnhover?: (event: MouseEvent) => void
}

type UseHoverBaseParamsWithoutExternalRef<TElement> = UseHoverBaseParams<TElement> & {
  externalRef?: undefined
}

interface UseHoverBaseReturn {
  /**
   * A ref to the DOM element to measure.
   */
  isHovered: boolean
}

interface UseHoverReturnWithFromRef<TElement> extends UseHoverBaseReturn {
  /**
   * A ref to the DOM element to measure.
   */
  fromRef: React.RefObject<TElement | null>
}

export function useHover<TElement extends HTMLElement = HTMLElement>({
  onHover,
  externalRef,
  onUnhover,
}: UseHoverBaseParams<TElement>): typeof externalRef extends undefined
  ? UseHoverBaseReturn
  : UseHoverReturnWithFromRef<TElement>

export function useHover<TElement extends HTMLElement = HTMLElement>({
  onHover,
  onUnhover,
}: UseHoverBaseParamsWithoutExternalRef<TElement>): UseHoverReturnWithFromRef<TElement>

export function useHover<
  TElement extends HTMLElement = HTMLElement,
>(): UseHoverReturnWithFromRef<TElement>

/**
 * A hook that detects hover events on a specified element.
 *
 * This hook provides an easy way to detect when users hover over a specific
 * element, commonly used for tooltips, dropdowns, or other interactive components.
 * You can either provide your own ref or use the ref returned by the hook.
 * @param params - Configuration object for the hover detection
 * @param params.onHover - Callback function called when the element is hovered
 * @param params.onUnhover - Callback function called when the element is unhovered
 * @param params.externalRef - Optional ref to an existing element. If not provided, the hook returns a ref to use
 */
export function useHover<TElement extends HTMLElement = HTMLElement>({
  onHover,
  externalRef,
  onUnhover,
}: UseHoverBaseParams<TElement> | UseHoverBaseParamsWithoutExternalRef<TElement> | undefined = {}) {
  const { value: isHovered, set: setIsHovered } = useBoolean()
  const fromRef = useRef<TElement>(null)

  const getResolvedTarget = useCallback(() => {
    if (externalRef === undefined) {
      return fromRef.current
    }

    if (externalRef === null) return null

    return externalRef.current === null ? null : externalRef.current
  }, [externalRef])

  useEventListener(
    'mouseenter',
    (event) => {
      setIsHovered(true)
      onHover?.(event)
    },
    getResolvedTarget() as HTMLElement,
  )
  useEventListener(
    'mouseout',
    (event) => {
      setIsHovered(false)
      onUnhover?.(event)
    },
    getResolvedTarget() as HTMLElement,
  )

  if (externalRef === undefined)
    return {
      isHovered,
      fromRef,
    }

  return {
    isHovered,
  }
}
