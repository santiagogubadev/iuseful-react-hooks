import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { usePointerDownOutSide } from '@/hooks'
import { fireEvent, renderHook } from '@testing-library/react'
import { useRef } from 'react'

describe('usePointerDownOutSide', () => {
  assertHook(usePointerDownOutSide)

  const onPointerDownOutside = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('without external ref', () => {
    it('should return fromRef when no externalRef is provided', () => {
      const { result } = renderHook(() => usePointerDownOutSide({ onPointerDownOutside }))

      expect(result.current).toEqual({
        fromRef: expect.any(Object),
      })
      expect(result.current.fromRef.current).toBeNull()
    })

    it('should call onPointerDownOutside when pointerdown outside the element', () => {
      const { result } = renderHook(() => usePointerDownOutSide({ onPointerDownOutside }))

      const div = document.createElement('div')
      document.body.appendChild(div)

      result.current.fromRef.current = div

      fireEvent.pointerDown(document.body)

      expect(onPointerDownOutside).toHaveBeenCalledTimes(1)
      expect(onPointerDownOutside).toHaveBeenCalledWith(expect.any(PointerEvent))

      document.body.removeChild(div)
    })

    it('should not call onPointerDownOutside when pointerdown inside the element', () => {
      const { result } = renderHook(() => usePointerDownOutSide({ onPointerDownOutside }))

      const div = document.createElement('div')
      document.body.appendChild(div)

      result.current.fromRef.current = div

      fireEvent.pointerDown(div)

      expect(onPointerDownOutside).not.toHaveBeenCalled()

      document.body.removeChild(div)
    })

    it('should not call onPointerDownOutside when element is null', () => {
      renderHook(() => usePointerDownOutSide({ onPointerDownOutside }))

      fireEvent.pointerDown(document.body)

      expect(onPointerDownOutside).not.toHaveBeenCalled()
    })
  })

  describe('with external ref', () => {
    it('should return void when externalRef is provided', () => {
      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(null))
      const { result } = renderHook(() =>
        usePointerDownOutSide({ onPointerDownOutside, externalRef: refResult.current }),
      )

      expect(result.current).toBeUndefined()
    })

    it('should call onPointerDownOutside when pointerdown outside the external element', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(div))
      renderHook(() =>
        usePointerDownOutSide({ onPointerDownOutside, externalRef: refResult.current }),
      )

      fireEvent.pointerDown(document.body)

      expect(onPointerDownOutside).toHaveBeenCalledTimes(1)
      expect(onPointerDownOutside).toHaveBeenCalledWith(expect.any(PointerEvent))

      document.body.removeChild(div)
    })

    it('should not call onPointerDownOutside when pointerdown inside the external element', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(div))
      renderHook(() =>
        usePointerDownOutSide({ onPointerDownOutside, externalRef: refResult.current }),
      )

      fireEvent.pointerDown(div)

      expect(onPointerDownOutside).not.toHaveBeenCalled()

      document.body.removeChild(div)
    })

    it('should not call onPointerDownOutside when external element is null', () => {
      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(null))
      renderHook(() =>
        usePointerDownOutSide({ onPointerDownOutside, externalRef: refResult.current }),
      )

      fireEvent.pointerDown(document.body)

      expect(onPointerDownOutside).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle pointerdown on child elements correctly', () => {
      const { result } = renderHook(() => usePointerDownOutSide({ onPointerDownOutside }))

      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(child)
      document.body.appendChild(parent)

      result.current.fromRef.current = parent

      fireEvent.pointerDown(child)

      expect(onPointerDownOutside).not.toHaveBeenCalled()

      document.body.removeChild(parent)
    })

    it('should handle multiple nested elements', () => {
      const { result } = renderHook(() => usePointerDownOutSide({ onPointerDownOutside }))

      const grandparent = document.createElement('div')
      const parent = document.createElement('div')
      const child = document.createElement('span')

      parent.appendChild(child)
      grandparent.appendChild(parent)
      document.body.appendChild(grandparent)

      result.current.fromRef.current = grandparent

      fireEvent.pointerDown(child)

      expect(onPointerDownOutside).not.toHaveBeenCalled()

      fireEvent.pointerDown(document.body)

      expect(onPointerDownOutside).toHaveBeenCalledTimes(1)

      document.body.removeChild(grandparent)
    })

    it('should work correctly when element changes', () => {
      const { result } = renderHook(() => usePointerDownOutSide({ onPointerDownOutside }))

      const div1 = document.createElement('div')
      const div2 = document.createElement('div')
      document.body.appendChild(div1)
      document.body.appendChild(div2)

      result.current.fromRef.current = div1

      fireEvent.pointerDown(div2)
      expect(onPointerDownOutside).toHaveBeenCalledTimes(1)

      result.current.fromRef.current = div2

      fireEvent.pointerDown(div1)
      expect(onPointerDownOutside).toHaveBeenCalledTimes(2)

      fireEvent.pointerDown(div2)
      expect(onPointerDownOutside).toHaveBeenCalledTimes(2)

      document.body.removeChild(div1)
      document.body.removeChild(div2)
    })

    it('should pass the correct PointerEvent to onPointerDownOutside', () => {
      const { result } = renderHook(() => usePointerDownOutSide({ onPointerDownOutside }))

      const div = document.createElement('div')
      document.body.appendChild(div)
      result.current.fromRef.current = div

      const pointerEvent = new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: 100,
        clientY: 200,
        pointerId: 1,
        pointerType: 'mouse',
      })

      document.body.dispatchEvent(pointerEvent)

      expect(onPointerDownOutside).toHaveBeenCalledTimes(1)
      const receivedEvent = onPointerDownOutside.mock.calls[0][0]
      expect(receivedEvent).toBeInstanceOf(PointerEvent)
      expect(receivedEvent.clientX).toBe(100)
      expect(receivedEvent.clientY).toBe(200)
      expect(receivedEvent.pointerId).toBe(1)
      expect(receivedEvent.pointerType).toBe('mouse')

      document.body.removeChild(div)
    })
  })
})
