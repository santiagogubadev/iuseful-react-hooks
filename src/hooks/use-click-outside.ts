import { useRef } from 'react'
import { useEventListener } from './use-event-listener'

interface UseClickOutSideBaseParams<TElement> {
  /**
   * A callback function that is called when a click outside the element is detected.
   * @param event The mouse event.
   */
  onClickOutside?: (event: MouseEvent) => void
  /**
   * A ref to the DOM element to detect outside clicks.
   */
  externalRef?: React.RefObject<TElement | null>
}

type UseClickOutSideParamsWithBothParams<TElement> = Required<UseClickOutSideBaseParams<TElement>>

type UseClickOutSideParamsWithoutExternalRef<TElement> = UseClickOutSideBaseParams<TElement> & {
  externalRef?: undefined
}

interface UseClickOutSideReturn<TElement> {
  /**
   * A ref to the DOM element to measure.
   */
  fromRef: React.RefObject<TElement | null>
}

export function useClickOutSide<TElement extends HTMLElement = HTMLElement>({
  onClickOutside,
  externalRef,
}: UseClickOutSideParamsWithBothParams<TElement>): void

export function useClickOutSide<TElement extends HTMLElement = HTMLElement>({
  onClickOutside,
  externalRef,
}: UseClickOutSideParamsWithoutExternalRef<TElement>): UseClickOutSideReturn<TElement>

export function useClickOutSide<
  TElement extends HTMLElement = HTMLElement,
>(): UseClickOutSideReturn<TElement>

/**
 * A hook that detects clicks outside of a specified element.
 *
 * This hook provides an easy way to detect when users click outside of a specific
 * element, commonly used for closing modals, dropdowns, or other overlay components.
 * You can either provide your own ref or use the ref returned by the hook.
 *
 * @param params - Configuration object for the click outside detection
 * @param params.onClickOutside - Callback function called when a click outside the element is detected
 * @param params.externalRef - Optional ref to an existing element. If not provided, the hook returns a ref to use
 * @returns When externalRef is provided, returns void. Otherwise returns an object with a ref to attach to your element
 *
 * @example
 * ```tsx
 * // Using the ref returned by the hook
 * function DropdownMenu() {
 *   const [isOpen, setIsOpen] = useState(false)
 *   const { fromRef } = useClickOutSide({
 *     onClickOutside: () => setIsOpen(false)
 *   })
 *
 *   return (
 *     <div>
 *       <button onClick={() => setIsOpen(true)}>Open Menu</button>
 *       {isOpen && (
 *         <div ref={fromRef}>
 *           <p>Menu content here...</p>
 *         </div>
 *       )}
 *     </div>
 *   )
 * }
 *
 * // Using an external ref
 * function Modal() {
 *   const modalRef = useRef(null)
 *   const [isOpen, setIsOpen] = useState(false)
 *
 *   useClickOutSide({
 *     externalRef: modalRef,
 *     onClickOutside: () => setIsOpen(false)
 *   })
 *
 *   return isOpen ? <div ref={modalRef}>Modal content</div> : null
 * }
 * ```
 */
export function useClickOutSide<TElement extends HTMLElement = HTMLElement>({
  onClickOutside,
  externalRef,
}:
  | UseClickOutSideParamsWithBothParams<TElement>
  | UseClickOutSideParamsWithoutExternalRef<TElement>
  | undefined = {}) {
  const fromRef = useRef<TElement>(null)

  useEventListener(
    'click',
    (e) => {
      const element = externalRef?.current ?? fromRef.current
      if (element == null || element.contains(e.target as Node)) return
      onClickOutside?.(e)
    },
    document,
  )

  if (externalRef !== undefined) return

  return { fromRef }
}
