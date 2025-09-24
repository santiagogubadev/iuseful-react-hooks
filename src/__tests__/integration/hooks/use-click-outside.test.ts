import { assertHook } from '@/__tests__/__tests-utils__/assertions'
import { useClickOutSide } from '@/hooks'
import { fireEvent, renderHook } from '@testing-library/react'
import { useRef } from 'react'

describe('useClickOutSide', () => {
  assertHook(useClickOutSide)

  const onClickOutside = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('without external ref', () => {
    it('should return fromRef when no externalRef is provided', () => {
      const { result } = renderHook(() => useClickOutSide({ onClickOutside }))

      expect(result.current).toEqual({
        fromRef: expect.any(Object),
      })
      expect(result.current.fromRef.current).toBeNull()
    })

    it('should call onClickOutside when clicking outside the element', () => {
      const { result } = renderHook(() => useClickOutSide({ onClickOutside }))

      const div = document.createElement('div')
      document.body.appendChild(div)

      result.current.fromRef.current = div

      fireEvent.click(document.body)

      expect(onClickOutside).toHaveBeenCalledTimes(1)
      expect(onClickOutside).toHaveBeenCalledWith(expect.any(MouseEvent))

      document.body.removeChild(div)
    })

    it('should not call onClickOutside when clicking inside the element', () => {
      const { result } = renderHook(() => useClickOutSide({ onClickOutside }))

      const div = document.createElement('div')
      document.body.appendChild(div)

      result.current.fromRef.current = div

      fireEvent.click(div)

      expect(onClickOutside).not.toHaveBeenCalled()

      document.body.removeChild(div)
    })

    it('should not call onClickOutside when element is null', () => {
      renderHook(() => useClickOutSide({ onClickOutside }))

      fireEvent.click(document.body)

      expect(onClickOutside).not.toHaveBeenCalled()
    })
  })

  describe('with external ref', () => {
    it('should return void when externalRef is provided', () => {
      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(null))
      const { result } = renderHook(() =>
        useClickOutSide({ onClickOutside, externalRef: refResult.current }),
      )

      expect(result.current).toBeUndefined()
    })

    it('should call onClickOutside when clicking outside the external element', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(div))
      renderHook(() => useClickOutSide({ onClickOutside, externalRef: refResult.current }))

      fireEvent.click(document.body)

      expect(onClickOutside).toHaveBeenCalledTimes(1)
      expect(onClickOutside).toHaveBeenCalledWith(expect.any(MouseEvent))

      document.body.removeChild(div)
    })

    it('should not call onClickOutside when clicking inside the external element', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(div))
      renderHook(() => useClickOutSide({ onClickOutside, externalRef: refResult.current }))

      fireEvent.click(div)

      expect(onClickOutside).not.toHaveBeenCalled()

      document.body.removeChild(div)
    })

    it('should not call onClickOutside when external element is null', () => {
      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(null))
      renderHook(() => useClickOutSide({ onClickOutside, externalRef: refResult.current }))

      fireEvent.click(document.body)

      expect(onClickOutside).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle clicks on child elements correctly', () => {
      const { result } = renderHook(() => useClickOutSide({ onClickOutside }))

      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(child)
      document.body.appendChild(parent)

      result.current.fromRef.current = parent

      fireEvent.click(child)

      expect(onClickOutside).not.toHaveBeenCalled()

      document.body.removeChild(parent)
    })

    it('should handle multiple nested elements', () => {
      const { result } = renderHook(() => useClickOutSide({ onClickOutside }))

      const grandparent = document.createElement('div')
      const parent = document.createElement('div')
      const child = document.createElement('span')

      parent.appendChild(child)
      grandparent.appendChild(parent)
      document.body.appendChild(grandparent)

      result.current.fromRef.current = grandparent

      fireEvent.click(child)

      expect(onClickOutside).not.toHaveBeenCalled()

      fireEvent.click(document.body)

      expect(onClickOutside).toHaveBeenCalledTimes(1)

      document.body.removeChild(grandparent)
    })

    it('should work correctly when element changes', () => {
      const { result } = renderHook(() => useClickOutSide({ onClickOutside }))

      const div1 = document.createElement('div')
      const div2 = document.createElement('div')
      document.body.appendChild(div1)
      document.body.appendChild(div2)

      result.current.fromRef.current = div1

      fireEvent.click(div2)
      expect(onClickOutside).toHaveBeenCalledTimes(1)

      result.current.fromRef.current = div2

      fireEvent.click(div1)
      expect(onClickOutside).toHaveBeenCalledTimes(2)

      fireEvent.click(div2)
      expect(onClickOutside).toHaveBeenCalledTimes(2)

      document.body.removeChild(div1)
      document.body.removeChild(div2)
    })

    it('should pass the correct MouseEvent to onClickOutside', () => {
      const { result } = renderHook(() => useClickOutSide({ onClickOutside }))

      const div = document.createElement('div')
      document.body.appendChild(div)
      result.current.fromRef.current = div

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        clientX: 100,
        clientY: 200,
      })

      document.body.dispatchEvent(clickEvent)

      expect(onClickOutside).toHaveBeenCalledTimes(1)
      const receivedEvent = onClickOutside.mock.calls[0][0]
      expect(receivedEvent).toBeInstanceOf(MouseEvent)
      expect(receivedEvent.clientX).toBe(100)
      expect(receivedEvent.clientY).toBe(200)

      document.body.removeChild(div)
    })
  })
})
