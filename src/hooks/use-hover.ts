import { useRef } from 'react'
import { useBoolean } from './use-boolean'
import { useEventListener } from './use-event-listener'

interface UseHoverBaseParams<TElement> {
  /**
   * A ref to the DOM element to detect if it is hovered.
   */
  externalRef?: React.RefObject<TElement | null>
  /**
   * A callback function that is called when the element is hovered.
   * @param event The mouse event.
   */
  onHover?: (event: MouseEvent) => void
}

type UseHoverBaseParamsWithBothParams<TElement> = Required<UseHoverBaseParams<TElement>>

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
}: UseHoverBaseParamsWithBothParams<TElement>): UseHoverBaseReturn

export function useHover<TElement extends HTMLElement = HTMLElement>({
  onHover,
  externalRef,
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
 * @param params.externalRef - Optional ref to an existing element. If not provided, the hook returns a ref to use
 */
export function useHover<TElement extends HTMLElement = HTMLElement>({
  onHover,
  externalRef,
}:
  | UseHoverBaseParamsWithBothParams<TElement>
  | UseHoverBaseParamsWithoutExternalRef<TElement>
  | undefined = {}) {
  const { value: isHovered, set: setIsHovered } = useBoolean()
  const fromRef = useRef<TElement>(null)

  useEventListener(
    'mouseenter',
    (event) => {
      setIsHovered(true)
      onHover?.(event)
    },
    (externalRef?.current ?? fromRef?.current) as HTMLElement,
  )
  useEventListener(
    'mouseout',
    () => setIsHovered(false),
    (externalRef?.current ?? fromRef?.current) as HTMLElement,
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
