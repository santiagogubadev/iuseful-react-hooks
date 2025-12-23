import { useRef } from 'react'
import { useEventListener } from './use-event-listener'
import { isClient } from '@/utils/helpers/is-client'

interface UsePointerDownOutSideBaseParams<TElement> {
  onPointerDownOutside?: (event: PointerEvent) => void
  externalRef?: React.RefObject<TElement | null>
}

type UsePointerDownOutSideParamsWithBothParams<TElement> = Required<
  UsePointerDownOutSideBaseParams<TElement>
>

type UsePointerDownOutSideParamsWithoutExternalRef<TElement> =
  UsePointerDownOutSideBaseParams<TElement> & {
    externalRef?: undefined
  }

interface UsePointerDownOutSideReturn<TElement> {
  fromRef: React.RefObject<TElement | null>
}

export function usePointerDownOutSide<TElement extends HTMLElement = HTMLElement>({
  onPointerDownOutside,
  externalRef,
}: UsePointerDownOutSideParamsWithBothParams<TElement>): void

export function usePointerDownOutSide<TElement extends HTMLElement = HTMLElement>({
  onPointerDownOutside,
  externalRef,
}: UsePointerDownOutSideParamsWithoutExternalRef<TElement>): UsePointerDownOutSideReturn<TElement>

export function usePointerDownOutSide<
  TElement extends HTMLElement = HTMLElement,
>(): UsePointerDownOutSideReturn<TElement>

export function usePointerDownOutSide<TElement extends HTMLElement = HTMLElement>({
  onPointerDownOutside,
  externalRef,
}:
  | UsePointerDownOutSideParamsWithBothParams<TElement>
  | UsePointerDownOutSideParamsWithoutExternalRef<TElement>
  | undefined = {}) {
  const fromRef = useRef<TElement>(null)

  useEventListener(
    'pointerdown',
    (e) => {
      const element = externalRef?.current ?? fromRef.current
      if (element == null || element.contains(e.target as Node)) return
      onPointerDownOutside?.(e)
    },
    isClient ? document : undefined,
  )

  if (externalRef !== undefined) return

  return { fromRef }
}
